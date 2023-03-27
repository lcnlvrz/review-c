import { z } from 'zod'

export const reviewSchema = z
  .object({
    type: z.enum(['url', 'file']),
    url: z.string().url().optional().nullable(),
    storedKey: z.string().url().optional().nullable(),
  })
  .refine((data) => data.type === 'file' && !!data.storedKey, {
    path: ['storedKey'],
    message: 'File is required',
  })
  .refine((data) => data.type === 'url' && !!data.url, {
    path: ['url'],
    message: 'URL is required',
  })

export type ReviewSchema = z.infer<typeof reviewSchema>
