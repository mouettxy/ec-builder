<script setup lang="ts">
import { UploadFileInfo, useMessage } from 'naive-ui'
import {
  initJsPlumb,
  parseInstruction,
  resetJsPlumb,
  setupConnections,
  setupInstructionLinks,
  setupLayout,
} from '~/lib/flowchart'
import { FlowchartNode } from '~/lib/flowchart/types'

import { Instruction } from '~/lib/schema'
import { FileState, uploadSchema } from '~/lib/file'

const nodes = ref([] as FlowchartNode[])
const schemaName = ref('')

const fileState = ref('nofile' as FileState)
const notification = useMessage()

const handleFileChange = async ({
  file,
}: {
  file: UploadFileInfo
}): Promise<void> => {
  const uploadedFile = await uploadSchema(file)

  if (uploadedFile.parsedFile) {
    schemaName.value = uploadedFile.parsedFile.name
    nodes.value = setupInstructionLinks(
      parseInstruction(uploadedFile.parsedFile as Instruction)
    )

    const { width } = useWindowSize()

    const layerBaseline = width.value / 2 - 140
    const innerLayerBaselineLeft = layerBaseline - 280
    const innerLayerBaselineRight = layerBaseline + 280

    setupLayout(nodes.value, {
      layerHeight: 180,
      layerBaseline,
      innerLayerBaselineLeft,
      innerLayerBaselineRight,
      spacingX: 10,
    })

    nextTick(() => {
      initJsPlumb(document.querySelector('.ec-flowchart') as Element)

      setupConnections(nodes.value)
    })
  }

  notification.success(uploadedFile.message.value)
  fileState.value = uploadedFile.fileState.value
}

const handleReset = () => {
  resetJsPlumb()

  nodes.value = []
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

  <div v-if="nodes.length" class="ec-flowchart">
    <template v-for="node in nodes" :key="node.id">
      <ec-flowchart-node :node="node" />
    </template>
  </div>
</template>

<style>
.ec-flowchart {
  @apply flex flex-col items-center relative py-12;
}

.ec-flowchart .jtk-endpoint {
  @apply !hidden;
}

.ec-flowchart .jtk-overlay.label {
  @apply bg-white z-10 p-2;
}
</style>

<route lang="yaml">
name: flowchart
meta:
  header: Блок-схема
</route>
