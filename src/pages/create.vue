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
  <div class="w-[980px] mx-auto px-6 py-8">
    <div class="flex justify-between items-center">
      <ec-heading> Создание схемы </ec-heading>
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
        <n-button type="primary" @click="handleAddTopLevelNode">
          Добавить вопрос
        </n-button>
        <ec-file-upload
          v-if="!schema.nodes.length"
          button
          @file-change="handleFileChange"
        />
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
