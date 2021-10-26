import { nanoid } from 'nanoid'
import { Ref } from 'vue'

export type MessageType = 'hello' | 'text' | 'file' | 'chips'

export type Message = {
  id: string
  from?: boolean
  to?: boolean
  avatar?: boolean
  type: MessageType
  text: string
  chips?: any[]
  meta?: Record<string, any>
}

export type Messages = Message[]

const messages: Ref<Messages> = ref([
  {
    id: nanoid(),
    avatar: true,
    from: true,
    type: 'hello' as MessageType,
    text: '',
  },
  {
    id: nanoid(),
    from: true,
    type: 'file' as MessageType,
    text: 'Загрузите схему инструкции что-бы продолжить',
  },
])

export function useMessages() {
  const lastMessage = computed(() => {
    return messages.value[messages.value.length - 1]
  })

  return { messages, lastMessage }
}

export function useMessagesControls() {
  const addMessage = (message: Omit<Message, 'id'>) => {
    messages.value.push({ id: nanoid(), ...message })
  }

  const addMessages = (messagesToAdd: Omit<Message, 'id'>[]) => {
    let stagger = 0

    messagesToAdd.forEach((message) => {
      setTimeout(() => addMessage(message), stagger)
      stagger += 500
    })
  }

  const addMessagePair = ({
    toText,
    fromText,
    options,
  }: {
    toText: string
    fromText: string
    options?: any[]
  }) => {
    if (options) {
      addMessages([
        { to: true, type: 'text', text: toText },
        {
          from: true,
          type: 'text',
          text: fromText,
          avatar: true,
          chips: options,
        },
      ])
    } else {
      addMessages([
        { to: true, type: 'text', text: toText },
        { from: true, type: 'text', text: fromText, avatar: true },
      ])
    }
  }

  return { addMessage, addMessages, addMessagePair }
}

export function useChatHello() {
  const { now } = useNow({ controls: true })

  const hours = now.value.getHours()

  const timeAwareHello = computed(() => {
    if (hours > 6 && hours < 12) {
      return 'Доброе утро!'
    } else if (hours >= 12 && hours < 18) {
      return 'Добрый день!'
    } else if (hours >= 18 && hours < 23) {
      return 'Добрый вечер!'
    } else {
      return 'Доброй ночи!'
    }
  })

  return timeAwareHello
}
