<script setup lang="ts">
import { PropType } from '@vue/runtime-core'
import { DECISION_DIMENSIONS, PROCESS_DIMENSIONS } from '~/lib/flowchart/consts'
import { FlowchartNode } from '~/lib/flowchart/types'

defineProps({
  node: {
    required: false,
    type: Object as PropType<FlowchartNode>,
    default: () => ({}),
  },
})
</script>

<template>
  <template v-if="node.type === 'decision'">
    <ec-ftemplate-decision
      :id="node.id"
      :top="node.position[0]"
      :left="node.position[1]"
      :width="DECISION_DIMENSIONS.WIDTH"
      :height="DECISION_DIMENSIONS.HEIGHT"
    >
      {{ node.text }}
    </ec-ftemplate-decision>

    <template v-for="children in node.childrens" :key="children.id">
      <template v-if="children.type === 'decision'">
        <ec-flowchart-node :node="children" />
      </template>

      <template v-else-if="children.type === 'process'">
        <ec-ftemplate-process
          :id="children.id"
          :top="children.position[0]"
          :left="children.position[1]"
          :width="PROCESS_DIMENSIONS.WIDTH"
          :height="PROCESS_DIMENSIONS.HEIGHT"
        >
          {{ children.text }}
        </ec-ftemplate-process>
      </template>
    </template>
  </template>
</template>
