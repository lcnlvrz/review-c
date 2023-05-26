import type { MessagePopulated } from 'common'

export const discriminateMessages = (messages: MessagePopulated[] = []) => {
  const [starterMessage, ...subsequentMessages] = messages

  return {
    starterMessage,
    subsequentMessages,
  }
}
