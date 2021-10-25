<script setup lang="ts">
import { PropType } from '@vue/runtime-core'
import chatAvatar from '~/assets/chat-avatar.png'
import { MessageType, useChatHello } from '~/lib/chat'

const props = defineProps({
  avatar: {
    required: false,
    type: Boolean,
  },
  message: {
    required: false,
    type: String,
    default: '',
  },
  type: {
    required: false,
    type: String as PropType<MessageType>,
    default: '',
  },
  from: {
    required: false,
    type: Boolean,
  },
  to: {
    required: false,
    type: Boolean,
  },
})

const helloText = useChatHello()
</script>

<template>
  <div v-if="from" class="ec-chat-message ec-chat-message--from">
    <div v-if="avatar" class="select-none absolute -top-1.5 -left-5">
      <img :src="chatAvatar" alt="Аватар бота" width="16" height="16" />
    </div>
    <div class="text-sm px-3 py-2">
      <slot>
        <template v-if="type === 'hello'">
          {{ helloText }}
        </template>
        <template v-else>
          {{ message }}
        </template>
      </slot>
    </div>
  </div>
  <div v-if="to" class="ec-chat-message ec-chat-message--to">
    <div v-if="avatar" class="absolute -top-1.5 left-1">
      <!-- <img :src="chatAvatar" alt="Аватар бота" width="16" height="16" /> -->
    </div>
    <div class="text-sm px-3 py-2">
      <div class="inline">
        <slot>
          <template v-if="type === 'file'">
            <div class="flex items-center space-x-4">
              <bx-bx-file class="w-5 h-5 text-gray-600" />
              <span class="text-gray-600 font-medium tracking-wide">{{ message }}</span>
            </div>
          </template>
          <template v-else>
            {{ message }}
          </template>
        </slot>
      </div>
    </div>
  </div>
</template>

<style>
.ec-chat-message {
  @apply relative inline-block max-w-3/5 shadow-md;
}

.ec-chat-message--to {
  @apply self-end bg-blue-300/20 rounded-l-lg rounded-tr-lg;
}

.ec-chat-message--from {
  @apply self-start bg-gray-100/20 rounded-r-lg rounded-tl-lg;
}
</style>
