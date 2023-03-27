import { z } from 'zod'

export const workspaceSchema = z.object({
  name: z.string().max(100, 'Name cannot be longer than 100 characters'),
  description: z
    .string()
    .max(280, 'Description cannot be longer than 280 characters'),
})

export type WorkspaceSchema = z.infer<typeof workspaceSchema>
