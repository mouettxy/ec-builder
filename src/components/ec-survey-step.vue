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
      <div class="w-[34px] h-[32px] items-center flex justify-center font-medium rounded-full border-gray-200 border-1">
        <span>{{ step }}</span>
      </div>
      <slot name="title">
        Заголовок
      </slot>
    </div>
    <div class="pl-12 py-2">
      <slot name="default" />
    </div>
  </div>
</template>
