import type { SSFunction, getPagePropsTypeSafety } from './compose'
import type { RetrieveReviewDetailOutput } from '@/../../packages/common'
import { ReviewService } from '@/services/review.service'
import * as z from 'zod'

const paramsSchema = z.object({
  reviewId: z.string().min(1),
  workspaceId: z.string().min(1),
})

export const withReviewDetail: SSFunction<{
  review: RetrieveReviewDetailOutput
}> = async (ctx, cookie) => {
  const params = paramsSchema.safeParse(ctx.params)

  if (!params.success) {
    return {
      notFound: true,
    }
  }

  try {
    return {
      props: {
        review: await ReviewService.detail(
          params.data.workspaceId,
          params.data.reviewId,
          cookie
        ),
      },
    }
  } catch (err) {
    return {
      notFound: true,
    }
  }
}
