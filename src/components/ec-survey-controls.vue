<script setup lang="ts">
const props = defineProps({
  current: {
    required: true,
    type: Number,
  },
  total: {
    required: true,
    type: Number,
  },
  disabledNext: {
    required: false,
    type: Boolean,
  },
})

const emits = defineEmits([
  'update:current',
  'click:prev',
  'click:next',
  'click:finish',
])
const currentStep = useVModel(props, 'current', emits)

const hasNextStep = computed(() => {
  return currentStep.value < props.total
})

const hasPrevStep = computed(() => {
  return currentStep.value > 1
})

const isFinish = computed(() => {
  return currentStep.value === props.total
})

const finish = () => {
  emits('click:finish')
}

const next = () => {
  if (!currentStep.value) {
    currentStep.value = 1
  } else if (currentStep.value >= props.total) {
    currentStep.value = props.total
  } else {
    currentStep.value++
  }

  emits('click:next')
}

const prev = () => {
  if (!currentStep.value) {
    currentStep.value = 1
  } else if (currentStep.value <= 1) {
    currentStep.value = 1
  } else {
    currentStep.value--
  }

  emits('click:prev')
}
</script>

<template>
  <div class="flex items-center space-x-4">
    <n-button v-if="hasPrevStep" dashed type="default" @click="prev">
      <bx-bx-chevron-left class="mr-2" />
      Назад
    </n-button>
    <n-button
      v-if="hasNextStep"
      :disabled="disabledNext"
      type="primary"
      @click="next"
    >
      Дальше
      <bx-bx-chevron-right class="ml-2" />
    </n-button>
    <n-button
      v-if="isFinish"
      :disabled="disabledNext"
      type="primary"
      @click="finish"
    >
      Завершить
      <bx-bx-chevron-right class="ml-2" />
    </n-button>
  </div>
</template>
