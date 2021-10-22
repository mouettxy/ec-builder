<script setup lang="ts">
import { PropType } from '@vue/runtime-core'
import { ECNode } from '~/lib/node'

const props = defineProps({
  node: {
    required: true,
    type: Object as PropType<ECNode>,
  },

})

const emits = defineEmits(['update:node'])

const nodeModel = useVModel(props, 'node', emits)
</script>

<template>
  <div>
    <div class="flex items-center w-full space-x-6">
      <h3 class="block flex-grow whitespace-nowrap font-medium">
        <n-text>
          {{ nodeModel.title }}
        </n-text>
      </h3>
      <n-input-group>
        <n-button size="small" ghost :type="nodeModel.value === true? 'primary' : 'default'" @click="(nodeModel.value = true, nodeModel.answer = '')">
          Да
        </n-button>
        <n-button size="small" ghost :type="nodeModel.value === false ? 'primary' : 'default'" @click="(nodeModel.value = false, nodeModel.answer = '')">
          Нет
        </n-button>
      </n-input-group>
    </div>
    <n-alert v-if="nodeModel.value === null" class="mt-2" type="info">
      Ответьте на вопрос выше нажав на кнопку "Да" или "Нет"
    </n-alert>
    <ec-survey-options v-model:node="nodeModel" />
  </div>
</template>
