import { Workspace } from '.prisma/client'
import { WorkspaceService } from '@/services/workspace.service'
import { SSFunction } from './compose'

export const withWorkspaces: SSFunction<{ workspaces: Workspace[] }> = async (
  ctx,
  cookie
) => {
  try {
    const workspaces = await WorkspaceService.list(cookie).then(
      (res) => res.workspaces
    )

    if (ctx.resolvedUrl === '/' && !ctx.query.workspaceId) {
      const [workspace] = workspaces

      return {
        redirect: {
          permanent: false,
          destination: `/${workspace.nanoid}`,
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
