<script setup lang="ts">
import { Ref } from '@vue/reactivity'
import cloneDeep from 'lodash.clonedeep'
import { nanoid } from 'nanoid'
import { useMessages, useMessagesControls } from '~/lib/chat'
import { FileState } from '~/lib/file'
import { ECNode, useEnrichedSchema } from '~/lib/schema'

const { messages, lastMessage } = useMessages()
const { addMessages } = useMessagesControls()
const { enrichedSchema } = useEnrichedSchema()
const fileState = ref('nofile') as Ref<FileState>
const toolbarStatus = ref('file')
const questions: Ref<(ECNode & { parent?: string })[] | null> = ref(null)
const currentQuestionIndex = ref(0)

const handleFileChange = (data: { fileName: string; fileState: Ref<FileState> }) => {
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
  const nodeIndex = newSchema.value.nodes.findIndex(node => node._id === id)
  newSchema.value.nodes.splice(0, nodeIndex)

  return newSchema
}

const useQuestions = (nodes: ECNode[]) => {
  const questions: Ref<any[]> = ref([])

  const flattenNode = (node: ECNode & { parent?: string }) => {
    questions.value.push({
      _id: node._id,
      id: node.id,
      type: 'question',
      title: node.title,
      parent: node.parent,
      value: node.value,
      when: node.when,
      answer: node.answer,
      options: node.options?.filter(e => e.type !== 'node') || [],
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

const getYesNoChips = () => [
  { id: nanoid(), title: 'Да', type: 'answer' },
  { id: nanoid(), title: 'Нет', type: 'answer' },
]

const addYesNoMessages = (to: string, from: string) => {
  addMessages([
    { to: true, type: 'text', text: to },
    {
      from: true,
      avatar: true,
      type: 'text',
      text: from,
      chips: getYesNoChips(),
    },
  ])
}

const addChipMessages = (to: string, from: string, options: any[]) => {
  addMessages([
    { to: true, type: 'text', text: to },
    {
      from: true,
      avatar: true,
      type: 'text',
      text: from,
      chips: options,
    },
  ])
}

const handleChipClick = (chip: any) => {
  if (!questions.value) {
    questions.value = useQuestions(buildSchemaFromId(chip._id).value.nodes).value
    addYesNoMessages(`Начать инструкцию с вопроса "${chip.title}"`, chip.title)
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
      if (!questions.value[currentQuestionIndex.value]) {
        return -1
      }
    }

    return questions.value?.findIndex((question, questionIndex) => {
      if (question.value !== null) { return false }
      if (!questions.value) { return false }
      if (questionIndex === currentQuestionIndex.value) { return false }
      if (question.when !== questions.value[currentQuestionIndex.value].value) { return false }

      return true
    }) || 0
  }

  if (chip.type === 'answer') {
    currentQuestion.value = chip.title === 'Да'
    currentQuestion.answer = chip.title

    questions.value = filterQuestions() || []

    currentQuestion.options = currentQuestion.options?.filter(e => e.when === currentQuestion.value)

    if (currentQuestion.options?.length) {
      // if question has relevant options
      addChipMessages(chip.title, 'Выберите один из вариантов ответа', currentQuestion.options)
    }
    else {
      // if next relevant option is also question
      currentQuestionIndex.value = getNextQuestionIndex()
      currentQuestion = questions.value[currentQuestionIndex.value]
      addYesNoMessages(chip.title, currentQuestion.title)
    }
  }
  else {
    currentQuestionIndex.value = getNextQuestionIndex()
    if (currentQuestionIndex.value === -1) {
      addMessages([
        { to: true, type: 'text', text: chip.title },
        {
          from: true,
          avatar: true,
          type: 'text',
          text: 'Заполнение инструкции завершено, скачивание запущено',
        },
      ])
    }
    else {
      const currentQuestion = questions.value[currentQuestionIndex.value]
      addYesNoMessages(chip.title, currentQuestion.title)
    }
  }
}
</script>

<template>
  <div class="flex flex-col shadow-lg h-screen w-[980px]">
    <div class="flex-shrink-0 flex justify-center py-2 border-0 border-b-1 border-gray-100">
      <h3 class="font-medium tracking-wide text-xl">
        Создание инструкции
      </h3>
    </div>
    <ec-chat class="flex-grow" :messages="messages" />
    <div class="flex-shrink-0 px-6 py-6">
      <ec-chat-toolbar v-model:status="toolbarStatus" @file-change="handleFileChange">
        <div class="flex flex-nowrap space-x-4 overflow-x-auto">
          <n-button v-for="chip in lastMessage.chips" :key="chip._id" class="rounded-full" type="primary" @click="handleChipClick(chip)">
            {{ chip.title }}
          </n-button>
        </div>
      </ec-chat-toolbar>
    </div>
  </div>
</template>

<route lang="yaml">
name: chat
meta:
  header: Чат-бот
</route>
