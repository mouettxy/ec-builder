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
    :style="`left:${left}px;top:${top}px;width:${width}px;height:${height}px;`"
    class="ec-ftemplate-decision"
    data-jtk-target="true"
    data-jtk-target-port-type="target"
  >
    <div style="position: relative">
      <svg :width="width" :height="height">
        <path
          :d="`M ${width / 2} 10 L ${width - 10} ${height / 2} L ${width / 2} ${
            height - 10
          } L 10 ${height / 2} Z`"
        />
        <foreignObject :width="width" :height="height">
          <div
            class="flex m-auto text-sm items-center justify-center text-center"
            :style="{ width: `${width - 80}px`, height: `${height}px` }"
          >
            <slot />
          </div>
        </foreignObject>
      </svg>
    </div>
  </div>
</template>

<style>
.ec-ftemplate-decision {
  @apply z-10 border-none overflow-visible bg-transparent absolute;
}

.ec-ftemplate-decision svg {
  @apply absolute stroke-black stroke-1 fill-white left-0 top-0;
}

.ec-ftemplate-decision text {
  @apply stroke-none fill-black font-sans text-sm font-normal;
}
</style>
