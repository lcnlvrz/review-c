import type { MessagePopulated } from './message'
import type { PointPopulated } from './point'
import type { Thread } from 'database'

export interface ThreadPopulated extends Thread {
  messages: MessagePopulated[]
  point: PointPopulated
}
