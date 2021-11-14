<script setup lang="ts">
import { Ref } from '@vue/reactivity'
import cloneDeep from 'lodash.clonedeep'
import { nanoid } from 'nanoid'
import { animate, spring, stagger } from 'motion'
import { useMessages, useMessagesControls } from '~/lib/chat'
import { FileState } from '~/lib/file'
import { Answers, createPdf } from '~/lib/pdf'
import { ECNode, resetSchema, useEnrichedSchema } from '~/lib/schema'

const { messages, lastMessage } = useMessages()
const { addMessages, addMessagePair } = useMessagesControls()
const { enrichedSchema } = useEnrichedSchema()
const fileState = ref('nofile') as Ref<FileState>
const toolbarStatus = ref('file')
const questions: Ref<(ECNode & { parent?: string })[] | null> = ref(null)
const currentQuestionIndex = ref(0)
const toolbar: any = ref(null)

const handleEnter = async (_: Element, done: () => void) => {
  animate(
    '.stagger',
    {
      opacity: [0, 1],
      x: [100, 0],
    },
    {
      delay: stagger(0.2),
      easing: spring({ velocity: 100, damping: 100 }),
    }
  ).finished.then(() => done())
}

const animateClick = (event: Event) => {
  if (event.target) {
    const el = event
      .composedPath()
      .find((e: any) => e.classList?.contains('stagger')) as HTMLElement

    if (toolbar.value.$el) {
      const clone = el.cloneNode(true) as HTMLElement
      toolbar.value.$el.appendChild(clone)
      clone.style.position = 'absolute'

      animate(
        clone as Element,
        {
          x: 400,
          y: -60,
          opacity: 0,
        },
        {
          duration: 0.7,
        }
      ).finished.then(() => toolbar.value.$el.removeChild(clone))
    }
  }
}

const handleFileChange = (data: {
  fileName: string
  fileState: Ref<FileState>
}) => {
  fileState.value = data.fileState.value
  toolbarStatus.value = 'chips'

  if (fileState.value === 'uploaded') {
    addMessages([
      { to: true, type: 'file', text: data.fileName },
      {
        avatar: true,
        from: true,
        type: 'text',
        text: 'С какого вопроса начать инструкцию?',
        chips: enrichedSchema.value.nodes,
      },
    ])
  }
}

const buildSchemaFromId = (id: string) => {
  const newSchema = ref(cloneDeep(enrichedSchema.value))
  const nodeIndex = newSchema.value.nodes.findIndex((node) => node._id === id)
  newSchema.value.nodes.splice(0, nodeIndex)

  return newSchema
}

const useQuestions = (nodes: ECNode[]) => {
  const questions: Ref<any[]> = ref([])

  const flattenNode = (node: ECNode & { parent?: string }) => {
    questions.value.push({
      _id: node._id,
      id: node.id,
      computedId: node.computedId,
      type: 'question',
      title: node.title,
      parent: node.parent,
      value: node.value,
      when: node.when,
      answer: node.answer,
      options: node.options?.filter((e) => e.type !== 'node') || [],
    })

    if (node.options) {
      node.options.forEach((option) => {
        if (option.type === 'node') {
          flattenNode({ ...option, parent: node._id })
        }
      })
    }
  }

  nodes.forEach((node) => {
    flattenNode(node)
  })

  return questions
}

const getYesNoChips = (type = 'answer') => [
  { _id: nanoid(), title: 'Да', type },
  { _id: nanoid(), title: 'Нет', type },
]

const handleChipClick = (chip: any, event: Event) => {
  animateClick(event)

  if (lastMessage.value.chips) {
    lastMessage.value.chips.forEach((e) => (e.disabled = true))
  }

  if (chip.type === 'new-schema') {
    fileState.value = 'nofile'
    toolbarStatus.value = 'file'
    questions.value = null
    currentQuestionIndex.value = 0
    resetSchema()

    addMessages([
      {
        from: true,
        type: 'file',
        text: 'Загрузите схему инструкции что-бы продолжить',
      },
    ])
    return
  }

  if (!questions.value) {
    questions.value = useQuestions(
      buildSchemaFromId(chip._id).value.nodes
    ).value
    addMessagePair({
      toText: `Начать инструкцию с вопроса "${chip.title}"`,
      fromText: chip.title,
      options: getYesNoChips(),
    })
    return
  }

  let currentQuestion = questions.value[currentQuestionIndex.value]

  const filterQuestions = () => {
    return questions.value?.filter((question) => {
      if (question.parent === currentQuestion._id) {
        return question.when === currentQuestion.value
      }

      return true
    })
  }

  const getNextQuestionIndex = (): number => {
    if (questions.value) {
      if (questions.value[currentQuestionIndex.value] === undefined) {
        return -1
      }
    }

    return (
      questions.value?.findIndex((question, questionIndex) => {
        if (question.value !== null) {
          return false
        }
        if (questions.value === null) {
          return false
        }
        if (questionIndex === currentQuestionIndex.value) {
          return false
        }
        // if (question.when !== questions.value[currentQuestionIndex.value].value) { return false }

        return true
      }) || -1
    )
  }

  if (chip.type === 'answer') {
    currentQuestion.value = chip.title === 'Да'
    currentQuestion.answer = chip.title

    questions.value = filterQuestions() || []

    currentQuestion.options = currentQuestion.options?.filter(
      (e) => e.when === currentQuestion.value
    )

    if (currentQuestion.options?.length) {
      // if question has relevant options
      addMessagePair({
        toText: chip.title,
        fromText: 'Выберите один из вариантов ответа',
        options: currentQuestion.options,
      })
    } else {
      // if next relevant option is also question
      currentQuestionIndex.value = getNextQuestionIndex()
      currentQuestion = questions.value[currentQuestionIndex.value]
      addMessagePair({
        toText: chip.title,
        fromText: currentQuestion.title,
        options: getYesNoChips(),
      })
    }
  } else {
    currentQuestionIndex.value = getNextQuestionIndex()

    if (currentQuestionIndex.value === -1) {
      chip.value = true

      const buildAnswers = (questions: any) => {
        const answers: Ref<Answers> = ref([])

        questions.forEach((q: any) => {
          const questionId = q.computedId || `${q.id}.`
          const question = `${questionId} ${q.title}`
          const questionAnswer = q.value ? 'Да' : 'Нет'
          const selectedOption = q.options.find((e: any) => e.value)

          if (selectedOption) {
            const indent =
              (questionId.split('.').filter((e: string) => e).length - 1) * 8
            answers.value.push({
              question,
              questionAnswer,
              selectedOption: `${selectedOption.computedId} ${selectedOption.title}`,
              indent,
            })
          } else {
            answers.value.push({
              question,
              questionAnswer,
              selectedOption: '',
              indent: 0,
            })
          }
        })

        return { answers }
      }
      const { answers } = buildAnswers(questions.value)

      createPdf(enrichedSchema.value.name, answers.value)

      addMessages([
        { to: true, type: 'text', text: chip.title },
        {
          from: true,
          type: 'text',
          text: 'Заполнение инструкции завершено, скачивание запущено',
          avatar: true,
        },
        {
          from: true,
          type: 'text',
          text: 'Загрузить ещё одну схему инструкции?',
          chips: [{ id: nanoid(), title: 'Да', type: 'new-schema' }],
        },
      ])
    } else {
      const currentQuestion = questions.value[currentQuestionIndex.value]
      chip.value = true

      addMessagePair({
        toText: chip.title,
        fromText: currentQuestion.title,
        options: getYesNoChips(),
      })
    }
  }
}
</script>

<template>
  <div class="flex flex-col shadow-lg h-screen w-full lg:w-[980px]">
    <div
      class="
        flex-shrink-0 flex
        justify-center
        py-2
        border-0 border-b-1 border-gray-100
      "
    >
      <h3 class="font-medium tracking-wide text-xl">Создание инструкции</h3>
    </div>
    <ec-chat class="flex-grow" :messages="messages" />
    <div class="flex-shrink-0 px-6 py-4">
      <ec-chat-toolbar
        v-model:status="toolbarStatus"
        @file-change="handleFileChange"
      >
        <transition-group
          ref="toolbar"
          tag="div"
          mode="out-in"
          :css="false"
          class="
            chat-tools
            min-h-[50px]
            w-auto
            overflow-y-hidden
            flex flex-nowrap
            py-2
            overflow-x-auto
          "
          appear
          @enter="handleEnter"
        >
          <n-button
            v-for="chip in lastMessage.chips"
            :key="chip._id || chip.id"
            :disabled="!!chip.disabled"
            class="stagger !outline-none rounded-full mr-4 transition-none"
            type="primary"
            @click="handleChipClick(chip, $event)"
          >
            {{ chip.title }}
          </n-button>
        </transition-group>
      </ec-chat-toolbar>
    </div>
  </div>
</template>

<style>
.chat-tools::-webkit-scrollbar {
  background-color: #fff;
  height: 4px;
}

.chat-tools::-webkit-scrollbar-track {
  background-color: #fff;
}

.chat-tools::-webkit-scrollbar-thumb {
  background-color: #dedee2;
  width: 2px;
}
</style>

<route lang="yaml">
name: chat
meta:
  header: Чат-бот
</route>
