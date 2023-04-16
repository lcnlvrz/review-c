import { reviewTypes } from '@/constants/review'
import { z } from 'zod'

export const reviewSchema = z
  .object({
    type: z.enum(reviewTypes),
    url: z.string().url().optional().nullable(),
    file: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.type !== 'FILE') {
        return true
      }

      return !!data.file
    },
    {
      path: ['file'],
      message: 'File is required',
    }
  )
  .refine(
    (data) => {
      if (data.type !== 'URL') {
        return true
      }

      return !!data.url
    },
    {
      path: ['url'],
      message: 'URL is required',
    }
  )

export type ReviewSchema = z.infer<typeof reviewSchema>
