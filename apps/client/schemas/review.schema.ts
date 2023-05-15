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

const websiteSchema = z.object({
  title: props.title,
  type: z.literal(typeEnum.enum.WEBSITE),
  website: z.string().url(),
})

export const reviewSchema = z.discriminatedUnion('type', [
  fileSchema,
  websiteSchema,
])

export type ReviewSchema = z.infer<typeof reviewSchema>
