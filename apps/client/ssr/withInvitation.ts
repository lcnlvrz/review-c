import { WorkspaceService } from '@/services/workspace.service'
import type { Invitation, User, Workspace } from 'database'
import type { SSFunction } from './compose'

export type InvitationWithRelations = Invitation & {
  workspace: Workspace
  invitedBy: User
}

export const withInvitation: SSFunction<{
  invitation: InvitationWithRelations
}> = async (ctx, cookie) => {
  const invalidInvestigation = {
    redirect: {
      destination: '/invalid-invitation',
      permanent: false,
    },
  }

  if (
    !ctx?.params?.invitationId ||
    typeof ctx?.params?.invitationId !== 'string' ||
    Array.isArray(ctx?.params?.invitationId)
  ) {
    return invalidInvestigation
  }

  try {
    const invitation = await WorkspaceService.checkInvitationRecipient(
      cookie as string,
      ctx?.params?.invitationId
    )

    return {
      props: {
        invitation,
      },
    }
  } catch (err) {
    return invalidInvestigation
  }
}
