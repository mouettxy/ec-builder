<script setup lang="ts">
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
</script>

<template>
  <div class="h-[54px]">
    <ec-chat-toolbar-file-transition>
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
    </ec-chat-toolbar-file-transition>

    <ec-chat-toolbar-chips-transition>
      <div v-if="status === 'chips'">
        <slot />
      </div>
    </ec-chat-toolbar-chips-transition>
  </div>
</template>
