import type { WorkspaceWithMember } from '@/providers/WorkspaceProvider'
import { WorkspaceService } from '@/services/workspace.service'
import type { Workspace } from 'database'
import type { SSFunction } from './compose'

export const withCurrentWorkspace: SSFunction<{
  currentWorkspace: WorkspaceWithMember
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

    console.log('workspace', workspace)

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
