<script setup lang="ts">
import { UploadFileInfo, useMessage } from 'naive-ui'
import { useFlowchartNodes, useFlowchartNodesControls } from '~/lib/flowchart'

import { Instruction } from '~/lib/schema'
import { FileState, uploadSchema } from '~/lib/file'

const schemaName = ref('')
const fileState = ref('nofile' as FileState)

const nodes = useFlowchartNodes()
const { clearNodes, setupNodes } = useFlowchartNodesControls()
const notification = useMessage()

const handleFileChange = async ({
  file,
}: {
  file: UploadFileInfo
}): Promise<void> => {
  const uploadedFile = await uploadSchema(file)

  if (uploadedFile.parsedFile) {
    schemaName.value = uploadedFile.parsedFile.name
    setupNodes(uploadedFile.parsedFile as Instruction)
  }

  notification.success(uploadedFile.message.value)
  fileState.value = uploadedFile.fileState.value
}

const handleReset = () => {
  clearNodes()
  schemaName.value = ''
  fileState.value = 'nofile'
}
</script>

<template>
  <div class="w-[980px] mx-auto px-6 py-8">
    <div class="flex justify-between items-center">
      <ec-heading v-if="schemaName" class="mb-4"> {{ schemaName }} </ec-heading>
      <ec-heading v-else class="mb-4"> Загрузите схему </ec-heading>
      <n-button v-if="nodes.length" dashed @click="handleReset">
        Сбросить
        <bx-bx-refresh class="ml-2" />
      </n-button>
    </div>
    <ec-file-upload
      v-if="fileState === 'nofile'"
      big
      @file-change="handleFileChange"
    />
  </div>

  <ec-flowchart :nodes="nodes" />
</template>

<route lang="yaml">
name: flowchart
meta:
  header: Блок-схема
</route>
