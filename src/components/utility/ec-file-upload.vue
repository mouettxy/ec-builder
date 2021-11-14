<script setup lang="ts">
import { UploadFileInfo } from 'naive-ui'

defineProps({
  big: {
    required: false,
    type: Boolean,
  },
  small: {
    required: false,
    type: Boolean,
  },
  button: {
    required: false,
    type: Boolean,
  },
})

const emits = defineEmits(['file-change'])

const handleChange = (data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
  event: ProgressEvent | Event | undefined
}) => {
  emits('file-change', data)
}
</script>

<template>
  <n-upload
    accept="application/json"
    :show-file-list="false"
    :on-change="handleChange"
    :class="{
      'ec-file-upload--big': big,
      'ec-file-upload--small': small,
      'ec-file-upload--button': button,
    }"
  >
    <n-upload-dragger v-if="big">
      <div class="mb-2">
        <n-icon size="48" :depth="3">
          <bx-bx-archive class="w-48 h-48" />
        </n-icon>
      </div>
      <n-text depth="2">
        Нажмите для загрузки или перетащите файл схемы в эту область.
      </n-text>
    </n-upload-dragger>
    <n-upload-dragger
      v-else-if="small"
      class="flex justify-center space-x-4 h-54px items-center"
    >
      <bx-bx-archive class="block w-8 h-8 text-primary" />
      <span class="font-medium text-primary">
        Нажмите для загрузки или перетащите файл схемы в эту область.
      </span>
    </n-upload-dragger>

    <n-button v-else-if="button" dashed type="default"
      >Загрузить схему</n-button
    >
  </n-upload>
</template>

<style>
.ec-file-upload--big .n-upload-trigger {
  @apply w-full;
}
</style>
