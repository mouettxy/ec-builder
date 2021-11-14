<script setup lang="ts">
defineProps({
  step: {
    required: false,
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <div>
    <div class="flex space-x-4 items-center">
      <div
        class="
          font-medium
          text-lg text-gray-600
          rounded-full
          border-gray-200 border-1
        "
      >
        <div class="block w-8 h-8 flex items-center justify-center">
          {{ step }}
        </div>
      </div>
      <slot name="title"> Заголовок </slot>
    </div>
    <div class="pl-12 py-2">
      <slot name="default" />
    </div>
  </div>
</template>
