<script setup lang="ts">
import { PropType } from '@vue/runtime-core'
import { addNodeChild, addNodeOption, ECNode } from '~/lib/schema'

const props = defineProps({
  node: {
    required: true,
    type: Object as PropType<ECNode>,
  },

  when: {
    required: false,
    type: Boolean,
  },
})

const emits = defineEmits(['update:node'])

const modal = ref(false)
const optionTypes = computed(() => {
  if (props.node?.creator) {
    return [
      {
        label: 'Вариант ответа',
        key: 'option',
      },
    ]
  }

  return [
    {
      label: 'Вариант ответа',
      key: 'option',
    },
    {
      label: 'Вопрос',
      key: 'node',
    },
  ]
})

const nodeModel = useVModel(props, 'node', emits)

const handleSelect = (key: 'option' | 'node') => {
  if (nodeModel.value.options) {
    if (key === 'option') { addNodeOption(nodeModel.value, props.when) }

    else if (key === 'node') { addNodeChild(nodeModel.value, props.when) }

    modal.value = false
  }
}

</script>

<template>
  <n-dropdown trigger="click" :options="optionTypes" @select="handleSelect">
    <n-button type="primary" @click="modal = true">
      <template #icon>
        <n-icon><bx-bx-plus /></n-icon>
      </template>
    </n-button>
  </n-dropdown>
</template>
