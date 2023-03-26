import { z } from 'zod'

export const emailSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
})

export type EmailSchema = z.infer<typeof emailSchema>
