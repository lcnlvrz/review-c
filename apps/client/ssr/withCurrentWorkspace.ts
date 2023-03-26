import { WorkspaceService } from '@/services/workspace.service'
import type { Workspace } from 'database'
import { SSFunction } from './compose'

export const withCurrentWorkspace: SSFunction<{
  currentWorkspace: Workspace
}> = async (ctx, cookie) => {
  if (!ctx?.params?.workspaceId || Array.isArray(ctx?.params?.workspaceId)) {
    return {
      notFound: true,
    }
  }

  try {
    const workspace = await WorkspaceService.detail(
      ctx?.params?.workspaceId as string,
      cookie
    )

    return {
      props: {
        currentWorkspace: workspace,
      },
    }
  } catch (err) {
    return {
      notFound: true,
    }
  }
}
