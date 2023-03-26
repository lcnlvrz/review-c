import { httpClient } from '@/http/client'
import type { InvitationsSchema } from '@/schemas/invitations.schema'
import type { Invitation, Workspace } from 'database'

export class WorkspaceService {
  static async list(cookie?: string): Promise<{
    workspaces: Workspace[]
  }> {
    return await httpClient
      .get('/workspace/me', {
        headers: {
          cookie,
        },
      })
      .then((res) => res.data)
  }

  static async detail(id: string, cookie?: string): Promise<Workspace> {
    return await httpClient
      .get(`/workspace/${id}`, {
        headers: {
          cookie,
        },
      })
      .then((res) => res.data)
  }

  static async invite(
    id: string,
    data: InvitationsSchema
  ): Promise<{ invitations: { id: number }[] }> {
    return await httpClient
      .post(`/workspace/${id}/invitation`, data)
      .then((res) => res.data)
  }

  static async listInvitations(
    id: string
  ): Promise<{ invitations: Invitation[] }> {
    return await httpClient
      .get(`/workspace/${id}/invitation`)
      .then((res) => res.data)
  }

  static async removeInvitation(workspaceId: string, invitationId: number) {
    return await httpClient
      .delete(`/workspace/${workspaceId}/invitation/${invitationId}`)
      .then((res) => res.data)
  }
}
