<script setup lang="ts">
import { PropType } from '@vue/runtime-core'

const props = defineProps({
  value: {
    required: false,
    type: Boolean as PropType<Boolean | undefined | null>,
  },
  size: {
    required: false,
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'medium',
  },
  show: {
    required: false,
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits(['click:yes', 'click:no', 'update:value'])

const valueModel = useVModel(props, 'value', emits)

const handleYesClick = (event: Event) => {
  valueModel.value = true
  emits('click:yes', event)
}
const handleNoClick = (event: Event) => {
  valueModel.value = false
  emits('click:no', event)
}
</script>

<template>
  <n-input-group>
    <n-button
      v-if="show"
      :size="size"
      ghost
      :type="valueModel ? 'primary' : 'default'"
      @click="handleYesClick"
    >
      Да
    </n-button>
    <n-button
      v-if="show"
      :size="size"
      ghost
      :type="!valueModel ? 'primary' : 'default'"
      @click="handleNoClick"
    >
      Нет
    </n-button>
    <slot />
  </n-input-group>
</template>
