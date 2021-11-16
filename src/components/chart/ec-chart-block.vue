<script setup lang="ts">
defineProps({
  left: {
    required: false,
    type: Number,
    default: 0,
  },
  top: {
    required: false,
    type: Number,
    default: 0,
  },
  width: {
    required: false,
    type: Number,
    default: 0,
  },
  height: {
    required: false,
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <div
    class="ec-chart-block"
    :style="{
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${height}px`,
    }"
  >
    <slot />
  </div>
</template>

<style>
.ec-chart-block {
  @apply border-black border-1 border-solid p-0.5 text-sm flex items-center justify-center text-center absolute;
}
</style>
