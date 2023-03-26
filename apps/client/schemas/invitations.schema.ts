import { z } from 'zod'

export const invitationsSchema = z.object({
  invitations: z.array(
    z.object({
      email: z.string().email('Invalid email address'),
    })
  ),
})

export type InvitationsSchema = z.infer<typeof invitationsSchema>
