<script setup lang="ts">
import FileSaver from 'file-saver'
import { addNode, ECNode, schema } from '~/lib/node'

watch(schema, value => console.log(value), { deep: true })

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

const handleSaveSchema = () => {
  const file = new Blob([JSON.stringify(schema)], {
    type: 'application/json',
  })

  FileSaver.saveAs(file, `${schema.name}.json`)
}

</script>

<template>
  <div class="w-[980px] px-6 py-8">
    <n-h2 prefix="bar">
      <n-text type="primary">
        Создание схемы
      </n-text>
    </n-h2>
    <div>
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
