<script setup lang="ts">
import FileSaver from 'file-saver'
import { addNode, ECNode, resetSchema, schema } from '~/lib/node'

// watch(schema, value => console.log(value), { deep: true })

const handleNodeDelete = (node: ECNode, parent: ECNode | null) => {
  if (!parent) {
    schema.nodes = schema.nodes.filter(e => e._id !== node._id).map((e, i) => {
      return {
        ...e,
        id: i + 1,
      }
    })
    return
  }

  if (parent.options) { parent.options = parent.options.filter(e => e._id !== node._id) }
}

const handleAddTopLevelNode = () => {
  addNode(schema.nodes)
}

const handleReset = () => {
  resetSchema()
}

const handleSaveSchema = () => {
  const file = new Blob([JSON.stringify(schema)], {
    type: 'application/json',
  })

  FileSaver.saveAs(file, `${schema.name}.json`)
}

</script>

<template>
  <div class="w-[980px] px-6 py-8">
    <div class="flex justify-between items-center">
      <n-h2 prefix="bar" class="mb-0">
        <n-text type="primary">
          Создание схемы
        </n-text>
      </n-h2>
      <n-button dashed @click="handleReset">
        Сбросить
        <bx-bx-refresh class="ml-2" />
      </n-button>
    </div>
    <div class="mt-6">
      <n-input v-model:value="schema.name" type="text" placeholder="Название" size="large" />
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
      <n-button dashed type="info" @click="handleAddTopLevelNode">
        Добавить вопрос
      </n-button>
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
