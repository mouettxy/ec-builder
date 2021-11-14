<script setup lang="ts">
import { animate } from 'motion'

const props = defineProps({
  from: {
    required: false,
    type: Boolean,
  },
})

const handleEnter = (element: Element) => {
  const el = element as HTMLElement
  const x = props.from ? -100 : 100

  animate(el, {
    opacity: [0, 1],
    x: [x, 0],
  })
}
</script>

<template>
  <transition appear :css="false" @enter="handleEnter">
    <slot />
  </transition>
</template>
