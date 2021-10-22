<script setup lang="ts">
import CollapseTransition from '@ivanv/vue-collapse-transition/src/CollapseTransition.vue'
import { Ref } from '@vue/reactivity'
// @ts-ignore
import pdfMake from 'pdfmake'
// @ts-ignore
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { schema, enrichWithFillData, ECNode } from '~/lib/node'

pdfMake.vfs = pdfFonts.pdfMake.vfs

enrichWithFillData(schema)

const current = ref(1)
const currentStatus = ref('process') as Ref<'process' | 'error' | 'wait' | 'finish'>

const totalQuestions = computed(() => {
  return schema.nodes.length
})

const isNodeCompleted = (node: ECNode) => {
  const hasSubnodes = node.options?.some(nodeEl => nodeEl.type === 'node')

  if (hasSubnodes) {
    const relevantNodes = node.options?.filter((nodeEl) => {
      if (nodeEl.type === 'option') {
        return false
      }

      if (nodeEl.when !== node.value) {
        return false
      }

      return true
    })

    if (!relevantNodes?.length) {
      return !!node.answer
    }

    return relevantNodes?.every(nodeEl => nodeEl.answer)
  }

  return !!node.answer
}
const downloadPdf = (name: string, answers: {
  question: string
  questionAnswer: string
  selectedOption: string
  indent: number
}[]) => {
  const ctx: any[] = []

  ctx.push({
    text: name, fontSize: 20, alignment: 'center',
  })

  ctx.push(' ')
  ctx.push(' ')

  answers.forEach((answer) => {
    ctx.push({
      text: `${answer.question} (${answer.questionAnswer})`, fontSize: 14, margin: [answer.indent, 0, 0, 0],
    })
    ctx.push({
      text: `${answer.selectedOption}`, fontSize: 14, margin: [answer.indent + 16, 4, 0, 4],
    })
  })

  pdfMake.createPdf({ content: ctx }).download(name)
}

const handleFinish = () => {
  const answers: {
    question: string
    questionAnswer: string
    selectedOption: string
    indent: number
  }[] = []

  const parseNodeAnswers = (node: ECNode, indent: number) => {
    answers.push({
      question: `${node.computedId || `${node.id}.`} ${node.title}`,
      questionAnswer: node.value ? 'Да' : 'Нет',
      selectedOption: node.answer || '',
      indent,
    })

    const hasSubnodes = node.options?.some(nodeEl => nodeEl.type === 'node')

    if (hasSubnodes) {
      node.options?.forEach((nodeOption) => {
        if (nodeOption.type === 'node') {
          parseNodeAnswers(nodeOption, indent + 8)
        }
      })
    }
  }

  schema.nodes.forEach(node => parseNodeAnswers(node, 0))

  downloadPdf(schema.name, answers)
}

</script>

<template>
  <div class="w-[980px] px-6 py-8">
    <n-h2 prefix="bar">
      <n-text type="primary">
        {{ schema.name }}
      </n-text>
    </n-h2>
    <div class="flex">
      <n-steps vertical :current="current" :status="currentStatus">
        <ec-survey-step
          v-for="(node, nodeIndex) in schema.nodes"
          :key="node._id"
          :step="node.id"
        >
          <template #title>
            <div class="flex items-center w-full space-x-6">
              <h3 class="block flex-grow whitespace-nowrap font-medium text-lg">
                <n-text>
                  {{ node.title }}
                </n-text>
              </h3>
              <template v-if="node.id && current === node.id">
                <n-input-group>
                  <n-button size="small" ghost :type="node.value === true? 'primary' : 'default'" @click="(node.value = true, node.answer = '')">
                    Да
                  </n-button>
                  <n-button size="small" ghost :type="node.value === false ? 'primary' : 'default'" @click="(node.value = false, node.answer = '')">
                    Нет
                  </n-button>
                </n-input-group>
              </template>
            </div>
          </template>

          <collapse-transition>
            <div v-if="node.id && current === node.id">
              <n-alert v-if="node.value === null" type="info">
                Ответьте на вопрос выше нажав на кнопку "Да" или "Нет"
              </n-alert>
              <ec-survey-options v-model:node="schema.nodes[nodeIndex]" />
              <ec-survey-controls v-model:current="current" :disabled-next="!isNodeCompleted(node)" class="mt-4" :total="totalQuestions" @click:finish="handleFinish" />
            </div>
          </collapse-transition>
        </ec-survey-step>
      </n-steps>
    </div>
  </div>
</template>
