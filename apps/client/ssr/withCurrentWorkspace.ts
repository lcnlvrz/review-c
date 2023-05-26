import type { SSFunction } from './compose'
import type { WorkspaceWithMember } from '@/providers/WorkspaceProvider'
import { WorkspaceService } from '@/services/workspace.service'
import * as z from 'zod'

const paramsSchema = z.object({
  workspaceId: z.string().min(1),
})

export const withCurrentWorkspace: SSFunction<{
  currentWorkspace: WorkspaceWithMember
}> = async (ctx, cookie) => {
  const params = paramsSchema.safeParse(ctx.params)

  if (!params.success) {
    return {
      notFound: true,
    }
  }

  try {
    const workspace = await WorkspaceService.detail(
      params.data.workspaceId,
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
