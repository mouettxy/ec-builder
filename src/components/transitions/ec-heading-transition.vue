<script setup lang="ts">
import { animate } from 'motion'

const handleEnter = (element: Element, done: () => void) => {
  animate(
    element.querySelector('.ec-heading__prefix') as HTMLElement,
    {
      opacity: [0, 1],
      y: [-16, 0],
    },
    { duration: 0.3 }
  )

  animate(
    element.querySelector('.ec-heading__text') as HTMLElement,
    {
      opacity: [0, 1],
      x: [-24, 0],
    },
    { duration: 0.5, delay: 0.3 }
  ).finished.then(() => done())
}
</script>

<template>
  <transition appear :css="false" @enter="handleEnter">
    <slot />
  </transition>
</template>
