<script setup lang="ts">
import { UploadFileInfo, useMessage } from 'naive-ui'
import {
  FlowchartNode,
  initJsPlumb,
  parseInstruction,
  setupConnections,
  setupInstructionLinks,
  setupLayout,
} from '~/lib/flowchart'

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
    nodes.value = setupInstructionLinks(
      parseInstruction(uploadedFile.parsedFile as Instruction)
    )

    setupLayout(nodes.value, {
      layerHeight: 180,
      layerBaseline: 500,
      innerLayerBaselineLeft: 240,
      innerLayerBaselineRight: 760,
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
</script>

<template>
  <div v-if="nodes.length" class="ec-flowchart">
    <template v-for="node in nodes" :key="node.id">
      <ec-flowchart-node :node="node" />
    </template>
  </div>
  <div v-else class="w-[980px] mx-auto px-6 py-8">
    <ec-heading class="mb-4">
      <template v-if="schemaName">{{ schemaName }}</template>
      <template v-else>Загрузите схему</template>
    </ec-heading>
    <ec-file-upload
      v-if="fileState === 'nofile'"
      big
      @file-change="handleFileChange"
    />
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
