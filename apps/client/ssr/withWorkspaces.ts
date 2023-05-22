import type { SSFunction } from './compose'
import { AuthService } from '@/services/auth.service'
import { WorkspaceService } from '@/services/workspace.service'
import type { Workspace } from 'database'

export const withWorkspaces: SSFunction<{ workspaces: Workspace[] }> = async (
  ctx,
  cookie
) => {
  try {
    const workspaces = await WorkspaceService.list(cookie).then(
      (res) => res.workspaces
    )

    if (ctx.resolvedUrl === '/' && !ctx.params?.workspaceId) {
      if (!workspaces.length) {
        const invitations = await AuthService.listInvitations(cookie).then(
          (res) => res.invitations
        )

        if (!invitations.length) {
          return {
            redirect: {
              destination: '/workspace/create',
              permanent: false,
            },
          }
        }

        const [invitation] = invitations

        return {
          redirect: {
            destination: `/invitation/${invitation.id}`,
            permanent: false,
          },
        }
      }

      const [workspace] = workspaces

      return {
        redirect: {
          permanent: false,
          destination: `/workspace/${workspace.id}`,
        },
      }
    }

    return {
      props: {
        workspaces,
      },
    }
  } catch (err) {
    return {
      props: {
        workspaces: [],
      },
    }
  }
}
