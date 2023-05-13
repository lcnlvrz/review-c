import type { Message, User } from '.prisma/client'

export interface MessagePopulated extends Message {
  sentBy: User
}
