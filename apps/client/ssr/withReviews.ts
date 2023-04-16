import type { WorkspaceWithMember } from '@/providers/WorkspaceProvider'
import { WorkspaceService } from '@/services/workspace.service'
import type { Workspace } from 'database'
import {
  ReturnTypeSSFunction,
  SSFunction,
  getPagePropsTypeSafety,
} from './compose'
import type { ListReviewsOutput } from '@/../../packages/common'
import type { UnionToIntersection } from '@tanstack/react-table'
import { ReviewService } from '@/services/review.service'

export const withReviews: SSFunction<{
  reviews: ListReviewsOutput['reviews']
}> = async (ctx, cookie, pageProps) => {
  const currentWorkspace = getPagePropsTypeSafety(pageProps, 'currentWorkspace')

  console.log('currentWorkspace', currentWorkspace)

  try {
    const { reviews } = await ReviewService.listReviews(
      currentWorkspace.id,
      cookie
    )

    return {
      props: {
        reviews,
      },
    }
  } catch (err) {
    return {
      notFound: true,
    }
  }
}
