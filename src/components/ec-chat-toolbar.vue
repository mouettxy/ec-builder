<script setup lang="ts">
import { UploadFileInfo } from 'naive-ui'
import { uploadSchema } from '~/lib/file'

const props = defineProps({
  status: {
    required: false,
    type: String,
    default: 'file',
  },
})

const emits = defineEmits(['update:fileState', 'file-change'])

const handleFileChange = async({ file }: { file: UploadFileInfo }): Promise<void> => {
  const uploadedFile = await uploadSchema(file)
  emits('file-change', {
    fileState: uploadedFile.fileState,
    message: uploadedFile.message,
    fileName: file.name,
  })
}
</script>

<template>
  <div v-if="status === 'file'">
    <n-upload accept="application/json" :show-file-list="false" :on-change="handleFileChange">
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

  <div v-if="status === 'chips'">
    <slot />
  </div>
</template>
