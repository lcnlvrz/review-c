import { reviewTypes } from '@/constants/review'
import { z } from 'zod'

const props = {
  title: z.string().min(1, { message: 'Title is required' }),
}

const typeEnum = z.enum(reviewTypes)

const fileSchema = z.object({
  title: props.title,
  type: z.literal(typeEnum.enum.FILE),
  file: z.string(),
})

const urlSchema = z.object({
  title: props.title,
  type: z.literal(typeEnum.enum.URL),
  url: z.string().url(),
})

export const reviewSchema = z.discriminatedUnion('type', [
  fileSchema,
  urlSchema,
])

export type ReviewSchema = z.infer<typeof reviewSchema>
