<script setup lang="ts">
import { animate } from 'motion'
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
  animate(el, { scale: [0.7, 1] }, { duration: 0.3 }).finished.then(() =>
    done()
  )
}

const handleFileLeave = (element: Element, done: () => void) => {
  const el = element as HTMLElement
  animate(
    el,
    { scale: 0.5, opacity: 0, y: -100, display: 'absolute' },
    { duration: 0.3 }
  ).finished.then(() => done())
}

const handleChipsLeave = (element: Element, done: () => void) => {
  const el = element as HTMLElement
  animate(el, { opacity: 0 }).finished.then(() => done())
}
</script>

<template>
  <div class="h-[54px]">
    <transition appear @enter="handleEnter" @leave="handleFileLeave">
      <div v-if="status === 'file'">
        <n-upload
          accept="application/json"
          :show-file-list="false"
          :on-change="handleFileChange"
        >
          <n-upload-dragger
            class="flex justify-center space-x-4 h-54px items-center"
          >
            <bx-bx-archive class="block w-8 h-8 text-primary" />
            <span class="font-medium text-primary">
              Нажмите для загрузки или перетащите файл схемы в эту область.
            </span>
          </n-upload-dragger>
        </n-upload>
      </div>
    </transition>

    <transition appear @enter="handleEnter" @leave="handleChipsLeave">
      <div v-if="status === 'chips'">
        <slot />
      </div>
    </transition>
  </div>
</template>
