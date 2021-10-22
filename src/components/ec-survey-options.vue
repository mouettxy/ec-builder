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
  <n-radio-group v-model:value="nodeModel.answer" class="space-y-2">
    <div class="flex flex-col space-y-2">
      <template v-for="(option, optionIndex) in nodeModel.options" :key="option._id">
        <template v-if="option.type === 'option'">
          <n-radio
            v-if="option.when === nodeModel.value"
            :checked="!!option.value"
            :value="`${option.computedId} ${option.title}`"
            :name="nodeModel.title"
            type="info"
            @change="option.value = $event"
          >
            <div class="space-x-1 flex">
              <span class="block">{{ option.computedId }}</span>
              <span class="block">{{ option.title }}</span>
            </div>
          </n-radio>
        </template>
        <template v-if="option.type === 'node' && nodeModel.options">
          <ec-survey-subnode v-if="option.when === nodeModel.value" v-model:node="nodeModel.options[optionIndex]" />
        </template>
      </template>
    </div>
  </n-radio-group>
</template>
