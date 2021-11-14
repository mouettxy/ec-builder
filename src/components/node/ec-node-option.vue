<script setup lang="ts">
import { PropType } from '@vue/runtime-core'
import { ECNode, ECNodeOption } from '~/lib/schema'

const props = defineProps({
  node: {
    required: true,
    type: Object as PropType<ECNode>,
  },

  option: {
    required: true,
    type: Object as PropType<ECNodeOption>,
  },
})

const emits = defineEmits(['update:option', 'delete:option', 'delete:node'])

const optionModel = useVModel(props, 'option', emits)
</script>

<template>
  <template v-if="option.type === 'option'">
    <div class="flex">
      <div class="w-full">
        <ec-yes-no-group v-model:value="optionModel.when">
          <n-input
            v-model:value="optionModel.title"
            type="text"
            placeholder="Введите опцию"
          />
          <n-button ghost @click="emits('delete:option', option)">
            <template #icon>
              <n-icon><bx-bx-trash /></n-icon>
            </template>
          </n-button>
        </ec-yes-no-group>
      </div>
    </div>
  </template>

  <template v-if="option.type === 'node'">
    <ec-node
      v-model:node="optionModel"
      :parent="node"
      @delete:node="emits('delete:node', optionModel, node)"
    />
  </template>
</template>
