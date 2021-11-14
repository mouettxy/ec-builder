<script setup lang="ts">
import { animate, spring, stagger } from 'motion'

const handleEnter = async (_: Element, done: () => void) => {
  animate(
    '.stagger',
    {
      opacity: [0, 1],
      x: [100, 0],
    },
    {
      delay: stagger(0.2),
      easing: spring({ velocity: 100, damping: 100 }),
    }
  ).finished.then(() => done())
}
</script>

<template>
  <transition-group
    mode="out-in"
    :css="false"
    appear
    v-bind="$attrs"
    @enter="handleEnter"
  >
    <slot />
  </transition-group>
</template>
