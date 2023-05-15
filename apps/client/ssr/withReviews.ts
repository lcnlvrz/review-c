import { SSFunction, getPagePropsTypeSafety } from './compose'
import type { ListReviewsOutput } from '@/../../packages/common'
import { ReviewService } from '@/services/review.service'

export const withReviews: SSFunction<{
  reviews: ListReviewsOutput['reviews']
}> = async (ctx, cookie, pageProps) => {
  const currentWorkspace = getPagePropsTypeSafety(pageProps, 'currentWorkspace')

  console.log('ctx.resolvedUrl', ctx.resolvedUrl)

  try {
    const { reviews } = await ReviewService.listReviews(
      currentWorkspace.id,
      {
        scope: 'all',
      },
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
