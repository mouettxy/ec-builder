<script setup lang="ts">
import { PropType, Ref } from '@vue/runtime-core'
import { Messages } from '~/lib/chat'

const props = defineProps({
  messages: {
    required: false,
    type: Array as PropType<Messages>,
    default: () => [],
  },
})

const messagesLength = computed(() => props.messages.length)
const chat: Ref<HTMLElement | null> = ref(null)

const keepScroll = () => {
  if (chat.value) {
    chat.value.scrollTop = chat.value.scrollHeight + 200
  }
}

watch([messagesLength], () => {
  nextTick(() => {
    keepScroll()
    setTimeout(keepScroll, 200) // imperative time to change scroll when file input appears
  })
})
</script>

<template>
  <div ref="chat" class="ec-chat">
    <ec-chat-message
      v-for="message in messages"
      :key="message.id"
      :avatar="message.avatar"
      :to="message.to"
      :type="message.type"
      :from="message.from"
      :message="message.text"
    />
  </div>
</template>

<style>
.ec-chat {
  @apply relative space-y-4 py-4 overflow-y-auto overflow-x-hidden flex flex-col px-6;
}

.ec-chat::-webkit-scrollbar {
  background-color: #fff;
  width: 4px;
}

.ec-chat::-webkit-scrollbar-track {
  background-color: #fff;
}

.ec-chat::-webkit-scrollbar-thumb {
  background-color: #dedee2;
  width: 2px;
}
</style>
