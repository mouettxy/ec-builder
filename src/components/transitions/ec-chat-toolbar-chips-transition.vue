<script setup lang="ts">
import { animate } from 'motion'

const handleEnter = (element: Element, done: () => void) => {
  animate(
    element as HTMLElement,
    { scale: [0.7, 1] },
    { duration: 0.3 }
  ).finished.then(() => done())
}

const handleLeave = (element: Element, done: () => void) => {
  animate(element as HTMLElement, { opacity: 0 }).finished.then(() => done())
}
</script>

<template>
  <transition appear :css="false" @enter="handleEnter" @leave="handleLeave">
    <slot />
  </transition>
</template>
