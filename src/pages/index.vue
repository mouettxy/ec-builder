<script setup lang="ts">
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
  const { answers } = useSchemaAnswers(enrichedSchema.value.nodes)
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
  <div class="w-[980px] mx-auto px-6 py-8">
    <ec-heading class="mb-4">
      <template v-if="enrichedSchema.name">{{ enrichedSchema.name }}</template>
      <template v-else>Загрузите схему</template>
    </ec-heading>
    <div v-if="!enrichedSchema.nodes.length">
      <ec-file-upload
        v-if="fileState === 'nofile'"
        big
        @file-change="handleFileChange"
      />
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
                <ec-yes-no-group
                  v-model:value="node.value"
                  size="small"
                  @click:yes="node.answer = ''"
                  @click:no="node.answer = ''"
                />
              </template>
            </div>
          </template>

          <n-collapse-transition
            appear
            :show="!!node.id && current === node.id"
          >
            <div>
              <n-collapse-transition :show="node.value === null">
                <n-alert type="info">
                  Ответьте на вопрос выше нажав на кнопку "Да" или "Нет"
                </n-alert>
              </n-collapse-transition>
              <ec-survey-options
                v-model:node="enrichedSchema.nodes[nodeIndex]"
                class="mb-4"
              />
              <ec-survey-controls
                v-model:current="current"
                :disabled-next="!isNodeCompleted(node)"
                :total="totalQuestions"
                @click:finish="handleFinish"
              />
            </div>
          </n-collapse-transition>
        </ec-survey-step>
      </n-steps>
    </div>
  </div>
</template>

<route lang="yaml">
name: index
meta:
  header: Создание документа
</route>
