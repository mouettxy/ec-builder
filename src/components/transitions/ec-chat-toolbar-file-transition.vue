<script setup lang="ts">
import { animate } from 'motion'

const handleEnter = (element: Element, done: () => void) => {
  animate(
    element as HTMLElement,
    { scale: [0.7, 1] },
    { duration: 0.3 }
  ).finished.then(() => done())
}

const handleFileLeave = (element: Element, done: () => void) => {
  animate(
    element as HTMLElement,
    { scale: 0.5, opacity: 0, y: -100, display: 'absolute' },
    { duration: 0.3 }
  ).finished.then(() => done())
}
</script>

<template>
  <transition appear :css="false" @enter="handleEnter" @leave="handleFileLeave">
    <slot />
  </transition>
</template>
