import { z } from 'zod'

export const reviewSchema = z.object({
  workspaceId: z.string().min(1, 'Required'),
  reviewId: z.string().min(1, 'Required'),
})

export interface ReviewSchema extends z.infer<typeof reviewSchema> {}
