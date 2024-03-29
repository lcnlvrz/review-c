import type { SSFunction } from './compose'
import type { ListReviewsOutput } from '@/../../packages/common'
import { ReviewService } from '@/services/review.service'
import * as z from 'zod'

const paramsSchema = z.object({
  workspaceId: z.string().min(1),
})

export const withReviews: SSFunction<{
  reviews: ListReviewsOutput['reviews']
}> = async (ctx, cookie) => {
  const params = paramsSchema.safeParse(ctx.params)

  if (!params.success) {
    return {
      notFound: true,
    }
  }

  try {
    const { reviews } = await ReviewService.paginateReviews(
      params.data.workspaceId,
      undefined,
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
