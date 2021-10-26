<script setup lang="ts">
import CollapseTransition from '@ivanv/vue-collapse-transition/src/CollapseTransition.vue'
import { Ref } from '@vue/reactivity'
import { UploadFileInfo, useMessage } from 'naive-ui'
import { FileState, uploadSchema } from '~/lib/file'
import { createPdf } from '~/lib/pdf'
import {
  resetSchema,
  isNodeCompleted,
  useSchemaAnswers,
  useEnrichedSchema,
} from '~/lib/schema'

const { enrichedSchema } = useEnrichedSchema()

const current = ref(1)
const fileState = ref('nofile') as Ref<FileState>
const currentStatus = ref('process') as Ref<
  'process' | 'error' | 'wait' | 'finish'
>
const notification = useMessage()

const totalQuestions = computed(() => {
  return enrichedSchema.value.nodes.length
})

const handleFinish = () => {
  const { answers } = useSchemaAnswers()
  current.value = 1
  fileState.value = 'nofile'
  notification.success('Файл успешно сформирован, начинаем скачивание')
  createPdf(enrichedSchema.value.name, answers.value)
  resetSchema()
}

const handleFileChange = async ({
  file,
}: {
  file: UploadFileInfo
}): Promise<void> => {
  const uploadedFile = await uploadSchema(file)

  notification.success(uploadedFile.message.value)
  fileState.value = uploadedFile.fileState.value
}
</script>

<template>
  <div class="w-[980px] px-6 py-8">
    <n-h2 v-if="enrichedSchema.name" prefix="bar">
      <n-text type="primary">
        {{ enrichedSchema.name }}
      </n-text>
    </n-h2>
    <n-h2 v-else prefix="bar">
      <n-text type="primary"> Загрузите схему </n-text>
    </n-h2>
    <div v-if="!enrichedSchema.nodes.length">
      <n-upload
        v-if="fileState === 'nofile'"
        accept="application/json"
        :show-file-list="false"
        :on-change="handleFileChange"
      >
        <n-upload-dragger>
          <div class="mb-2">
            <n-icon size="48" :depth="3">
              <bx-bx-archive class="w-48 h-48" />
            </n-icon>
          </div>
          <n-text depth="2">
            Нажмите для загрузки или перетащите файл схемы в эту область.
          </n-text>
        </n-upload-dragger>
      </n-upload>
    </div>
    <div v-else class="flex">
      <n-steps vertical :current="current" :status="currentStatus">
        <ec-survey-step
          v-for="(node, nodeIndex) in enrichedSchema.nodes"
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
                  <n-button
                    size="small"
                    ghost
                    :type="node.value === true ? 'primary' : 'default'"
                    @click=";(node.value = true), (node.answer = '')"
                  >
                    Да
                  </n-button>
                  <n-button
                    size="small"
                    ghost
                    :type="node.value === false ? 'primary' : 'default'"
                    @click=";(node.value = false), (node.answer = '')"
                  >
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
              <ec-survey-options
                v-model:node="enrichedSchema.nodes[nodeIndex]"
              />
              <ec-survey-controls
                v-model:current="current"
                :disabled-next="!isNodeCompleted(node)"
                class="mt-4"
                :total="totalQuestions"
                @click:finish="handleFinish"
              />
            </div>
          </collapse-transition>
        </ec-survey-step>
      </n-steps>
    </div>
  </div>
</template>

<style>
.n-upload-trigger {
  @apply w-full;
}
</style>

<route lang="yaml">
name: index
meta:
  header: Создание документа
</route>
