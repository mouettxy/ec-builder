<script setup lang="ts">
import {
  initJsPlumb,
  resetJsPlumb,
  setupConnections,
  setupLayout,
  useFlowchartNodes,
} from '~/lib/flowchart'

const nodes = useFlowchartNodes()
const nodesLength = computed(() => nodes.value.length)

watch(nodesLength, (length) => {
  if (length > 0) {
    const { width } = useWindowSize()

    const layerBaseline = width.value / 2 - 140
    const innerLayerBaselineLeft = layerBaseline - 280
    const innerLayerBaselineRight = layerBaseline + 280

    setupLayout(nodes.value, {
      layerHeight: 140,
      layerBaseline,
      innerLayerBaselineLeft,
      innerLayerBaselineRight,
      spacingX: 10,
    })

    nextTick(() => {
      setupConnections(nodes.value)
    })
  } else {
    resetJsPlumb()
  }
})

onMounted(() => {
  nextTick(() => {
    initJsPlumb(document.querySelector('.ec-flowchart') as Element)
  })
})
</script>

<template>
  <div class="ec-flowchart-wrapper">
    <div class="ec-flowchart">
      <template v-if="nodes.length">
        <ec-flowchart-node v-for="node in nodes" :key="node.id" :node="node" />
      </template>
    </div>
  </div>
</template>

<style>
.ec-flowchart {
  @apply flex flex-col items-center relative py-12;
}

.ec-flowchart .jtk-endpoint {
  @apply !hidden;
}

.ec-flowchart .jtk-overlay.label {
  @apply bg-white z-10 p-2;
}
</style>
