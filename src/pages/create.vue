<script setup lang="ts">
import { UploadFileInfo } from 'naive-ui'
import { uploadSchema } from '~/lib/file'
import {
  addNode,
  deleteNode,
  ECNode,
  resetSchema,
  schemaToFile,
  useSchema,
} from '~/lib/schema'

const { schema } = useSchema()

const handleNodeDelete = (node: ECNode, parent: ECNode | null) =>
  deleteNode(node, parent)
const handleAddTopLevelNode = () => addNode(schema.nodes)
const handleReset = () => resetSchema()
const handleSaveSchema = () => schemaToFile()

const handleFileChange = ({ file }: { file: UploadFileInfo }): Promise<any> =>
  uploadSchema(file)
</script>

<template>
  <div class="w-[980px] px-6 py-8">
    <div class="flex justify-between items-center">
      <n-h2 prefix="bar" class="mb-0">
        <n-text type="primary"> Создание схемы </n-text>
      </n-h2>
      <n-button dashed @click="handleReset">
        Сбросить
        <bx-bx-refresh class="ml-2" />
      </n-button>
    </div>
    <div class="mt-6">
      <n-input
        v-model:value="schema.name"
        type="text"
        placeholder="Название"
        size="large"
      />
      <div class="mt-4">
        <ec-node
          v-for="(node, nodeIndex) in schema.nodes"
          :key="node._id"
          v-model:node="schema.nodes[nodeIndex]"
          :parent="null"
          is-first
          @delete:node="handleNodeDelete"
        />
      </div>
      <div class="flex space-x-4">
        <n-button dashed type="info" @click="handleAddTopLevelNode">
          Добавить вопрос
        </n-button>
        <n-upload
          v-if="!schema.nodes.length"
          accept="application/json"
          :show-file-list="false"
          :on-change="handleFileChange"
        >
          <n-button dashed type="default">Загрузить схему</n-button>
        </n-upload>
      </div>
      <n-button
        v-if="schema.nodes.length"
        class="mt-4"
        block
        dashed
        type="success"
        @click="handleSaveSchema"
      >
        <bx-bx-save />
        Скачать схему
      </n-button>
    </div>
  </div>
</template>

<route lang="yaml">
name: create
meta:
  header: Создание схемы
</route>
