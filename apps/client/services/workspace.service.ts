import { httpClient } from '@/http/client'
import type { WorkspaceWithMember } from '@/providers/WorkspaceProvider'
import type { InvitationsSchema } from '@/schemas/invitations.schema'
import type { WorkspaceSchema } from '@/schemas/workspace.schema'
import type { InvitationWithRelations } from '@/ssr/withInvitation'
import type { Invitation, Member, User, Workspace } from 'database'

export type MemberWithUser = Member & { user: User }

export type StringOrNumber = string | number

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

  static async detail(
    id: string,
    cookie?: string
  ): Promise<WorkspaceWithMember> {
    return await httpClient
      .get(`/workspace/${id}`, {
        headers: {
          cookie,
        },
      })
      .then((res) => res.data)
  }

  static async invite(
    workspaceId: StringOrNumber,
    data: InvitationsSchema
  ): Promise<{ invitations: { id: number }[] }> {
    return await httpClient
      .post(`/workspace/${workspaceId}/invitation`, data)
      .then((res) => res.data)
  }

  static async listInvitations(
    workspaceId: StringOrNumber
  ): Promise<{ invitations: Invitation[] }> {
    return await httpClient
      .get(`/workspace/${workspaceId}/invitation`)
      .then((res) => res.data)
  }

  static async listMembers(
    workspaceId: StringOrNumber
  ): Promise<{ members: MemberWithUser[] }> {
    return await httpClient
      .get(`/workspace/${workspaceId}/member`)
      .then((res) => res.data)
  }

  static async removeInvitation(
    workspaceId: StringOrNumber,
    invitationId: string
  ) {
    return await httpClient
      .delete(`/workspace/${workspaceId}/invitation/${invitationId}`)
      .then((res) => res.data)
  }

  static async removeMember(workspaceId: StringOrNumber, memberId: number) {
    return await httpClient
      .delete(`/workspace/${workspaceId}/member/${memberId}`)
      .then((res) => res.data)
  }

  static async createWorkspace(
    data: WorkspaceSchema
  ): Promise<{ workspaceId: string }> {
    return await httpClient.post(`/workspace`, data).then((res) => res.data)
  }

  static async acceptInvitation(invitationId: string): Promise<{
    memberId: number
  }> {
    return await httpClient
      .post(`/workspace/invitation/${invitationId}/accept`)
      .then((res) => res.data)
  }

  static async checkInvitationRecipient(
    cookie: string,
    invitationId: string
  ): Promise<InvitationWithRelations> {
    return await httpClient
      .get(`/workspace/invitation/${invitationId}/check-recipient`, {
        headers: {
          cookie,
        },
      })
      .then((res) => res.data)
  }
}
