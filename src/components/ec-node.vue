<script setup lang="ts">
import { PropType } from '@vue/runtime-core'
import { deleteNodeOption, ECNode, ECNodeOption } from '~/lib/node'

const props = defineProps({
  node: {
    required: true,
    type: Object as PropType<ECNode>,
  },

  parent: {
    required: false,
    type: Object as PropType<ECNode | null>,
    default: null,
  },

  isFirst: {
    required: false,
    type: Boolean,
  },
})

const emits = defineEmits(['update:node', 'delete:node'])

const nodeModel = useVModel(props, 'node', emits)

const nodeId = computed(() => {
  if (nodeModel.value.creator)
    return `${nodeModel.value.creator}.${nodeModel.value.id}`

  return nodeModel.value.id
})

const handleOptionDelete = (option: ECNodeOption) => {
  nodeModel.value.options = deleteNodeOption(props.node, option)
}

const handleNodeDelete = (node: ECNode, parent: ECNode | null) => {
  emits('delete:node', node, parent)
}
</script>

<template>
  <div class="ec-node rounded-lg">
    <div v-if="isFirst" class="bg-gray-100 text-gray-700 font-bold px-4 py-1 select-none rounded-md grid place-items-center">
      {{ nodeId }}
    </div>
    <div class="w-full" :class="{'col-span-2': !isFirst}">
      <n-input-group>
        <template v-if="!isFirst">
          <n-button dashed :type="nodeModel.when ? 'info' : 'default'" @click="nodeModel.when = true">
            Да
          </n-button>
          <n-button dashed :type="!nodeModel.when ? 'info' : 'default'" @click="nodeModel.when = false">
            Нет
          </n-button>
        </template>
        <n-input v-model:value="nodeModel.title" type="text" :placeholder="node._id" />
        <n-button ghost @click="handleNodeDelete(nodeModel, parent)">
          <template #icon>
            <n-icon><bx-bx-trash /></n-icon>
          </template>
        </n-button>
        <ec-node-add-option v-model:node="nodeModel" :when="true" />
      </n-input-group>
    </div>

    <div class="flex justify-center">
      <div class="w-0.5 h-full bg-gray-200"></div>
    </div>

    <div v-if="nodeModel.options" class="space-y-2 mt-2 pb-4">
      <ec-node-option
        v-for="(option, optionIndex) in node.options"
        :key="option._id"
        v-model:option="nodeModel.options[optionIndex]"
        :node="node"
        @delete:option="handleOptionDelete"
        @delete:node="handleNodeDelete"
      />
    </div>
  </div>
</template>

<style>
.ec-node {
  @apply grid grid-cols-[64px,_1fr] grid-rows-[34px,_1fr] gap-x-2;
}
</style>
