import { z } from 'zod'

export const messageSchema = z.object({
  message: z.string().min(1, 'Required'),
})

export interface MessageSchema extends z.infer<typeof messageSchema> {}
