import type { MarkerPopulated } from './marker'
import type { MessagePopulated } from './message'
import type { Thread, User } from 'database'

export interface ThreadPopulated extends Thread {
  messages: MessagePopulated[]
  marker: MarkerPopulated
  startedBy: User
}
