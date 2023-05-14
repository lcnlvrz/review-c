import type { Message, User, File } from 'database'

export interface MessagePopulated extends Message {
  files: (File & { src: string })[]
  sentBy: User
}
