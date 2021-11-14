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
      <ec-file-upload
        v-if="status === 'file'"
        small
        @file-change="handleFileChange"
      />
    </ec-chat-toolbar-file-transition>
    <ec-chat-toolbar-chips-transition>
      <slot v-if="status === 'chips'" />
    </ec-chat-toolbar-chips-transition>
  </div>
</template>
