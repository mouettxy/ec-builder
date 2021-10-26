<script setup lang="ts">
import { animate, spring } from 'motion'
import { UploadFileInfo } from 'naive-ui'
import { uploadSchema } from '~/lib/file'

defineProps({
  status: {
    required: false,
    type: String,
    default: 'file',
  },
})

const emits = defineEmits(['file-change'])

const handleFileChange = async ({
  file,
}: {
  file: UploadFileInfo
}): Promise<void> => {
  const uploadedFile = await uploadSchema(file)
  emits('file-change', {
    fileState: uploadedFile.fileState,
    message: uploadedFile.message,
    fileName: file.name,
  })
}

const handleEnter = (element: Element, done: () => void) => {
  const el = element as HTMLElement
  animate(
    el,
    { scale: [0.7, 1] },
    { easing: spring({ damping: 30 }) }
  ).finished.then(() => done())
}

const handleFileLeave = (element: Element, done: () => void) => {
  const el = element as HTMLElement
  animate(
    el,
    { scale: 0.5, opacity: 0, y: -100, display: 'absolute' },
    { easing: spring({ damping: 30 }) }
  ).finished.then(() => done())
}

const handleChipsLeave = (element: Element, done: () => void) => {
  const el = element as HTMLElement
  animate(el, { opacity: 0 }).finished.then(() => done())
}
</script>

<template>
  <transition appear @enter="handleEnter" @leave="handleFileLeave">
    <div v-if="status === 'file'">
      <n-upload
        accept="application/json"
        :show-file-list="false"
        :on-change="handleFileChange"
      >
        <n-upload-dragger>
          <div class="mb-2">
            <n-icon size="48" :depth="3">
              <bx-bx-archive class="w-48 h-48" />
            </n-icon>
          </div>
          <n-text depth="2">
            Нажмите для загрузки или перетащите файл схемы в эту область.
          </n-text>
        </n-upload-dragger>
      </n-upload>
    </div>
  </transition>

  <transition appear @enter="handleEnter" @leave="handleChipsLeave">
    <div v-if="status === 'chips'">
      <slot />
    </div>
  </transition>
</template>
