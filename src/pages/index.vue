<script setup lang="ts">
import { addNode, ECNode, getSampleNode } from '~/lib/node'

const schema = reactive(
  { ...getSampleNode() },
)

watch(schema, (value) => {
  console.log(value)
}, { deep: true })

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

  if (parent.options)
    parent.options = parent.options.filter(e => e._id !== node._id)
}

const handleAddTopLevelNode = () => {
  addNode(schema.nodes)
}

</script>

<template>
  <div class="w-[980px] px-6 py-8">
    <n-page-header class="py-4">
      <template #title>
        <h1 class="text-2xl">
          Создание схемы
        </h1>
      </template>
    </n-page-header>
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
    </div>
  </div>
</template>
