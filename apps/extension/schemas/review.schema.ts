import { z } from 'zod'

export const reviewSchema = z.object({
  workspace: z.object({
    id: z.string().min(1, 'Required'),
    name: z.string().min(1, 'Required'),
  }),
  review: z.object({
    id: z.string().min(1, 'Required'),
    title: z.string().min(1, 'Required'),
  }),
})

export type ReviewSchema = z.infer<typeof reviewSchema>
