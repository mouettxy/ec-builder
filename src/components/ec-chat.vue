<script setup lang="ts">
import { PropType } from '@vue/runtime-core'
import { Messages } from '~/lib/chat'

const props = defineProps({
  messages: {
    required: false,
    type: Array as PropType<Messages>,
    default: () => [],
  },
})
</script>

<template>
  <div class="space-y-4 py-4 overflow-y-auto flex flex-col px-6">
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
