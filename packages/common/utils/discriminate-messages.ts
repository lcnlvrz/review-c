import type { MessagePopulated } from 'common'

export const discriminateMessages = <T extends Omit<MessagePopulated, 'id'>>(
  messages: T[] = []
) => {
  const [starterMessage, ...subsequentMessages] = messages

  return {
    starterMessage,
    subsequentMessages,
  }
}
