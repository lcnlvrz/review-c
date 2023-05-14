import type { MessagePopulated } from 'common'

export const discriminateMessages = (
  messages: Omit<MessagePopulated, 'id'>[] = []
) => {
  const [starterMessage, ...subsequentMessages] = messages

  return {
    starterMessage,
    subsequentMessages,
  }
}
