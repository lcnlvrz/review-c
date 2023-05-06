import { z } from 'zod'

export const pointSchema = z.object({
  message: z.string().min(1, 'Required!'),
  xpath: z.string().min(1, 'Required!'),
  xPercentage: z.number(),
  yPercentage: z.number(),
})

export interface PointSchema extends z.infer<typeof pointSchema> {}
