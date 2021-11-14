<script setup lang="ts">
import { PropType } from '@vue/runtime-core'
import { ECNode } from '~/lib/schema'

const props = defineProps({
  node: {
    required: true,
    type: Object as PropType<ECNode>,
  },
})

const emits = defineEmits(['update:node'])

const nodeModel = useVModel(props, 'node', emits)

const nodeModelValue = computed(() => nodeModel.value.value)
watch([nodeModelValue], () => {
  nodeModel.value.answer = ''
})
</script>

<template>
  <div>
    <div class="flex items-center w-full space-x-6">
      <h3 class="block flex-grow whitespace-nowrap font-medium">
        <n-text>
          {{ nodeModel.title }}
        </n-text>
      </h3>
      <ec-yes-no-group v-model:value="nodeModel.value" size="small" />
    </div>
    <n-collapse-transition appear :show="nodeModel.value === null">
      <n-alert class="mt-2" type="info">
        Ответьте на вопрос выше нажав на кнопку "Да" или "Нет"
      </n-alert>
    </n-collapse-transition>
    <ec-survey-options v-model:node="nodeModel" />
  </div>
</template>
