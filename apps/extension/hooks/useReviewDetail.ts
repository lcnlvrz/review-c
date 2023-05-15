import { useAPI } from './useAPI'
import { useQuery } from '@tanstack/react-query'
import type { Host } from '~lib/resolve-host'
import { useReview } from '~providers/ReviewProvider'

export const buildReviewDetailQueryKey = (reviewId: string) => {
  return `review-${reviewId}`
}

//TODO: remove host prop drilling and distribute host via context
export const useReviewDetail = (props: { host: Host }) => {
  const reviewAPI = useAPI('review')
  const ctx = useReview()

  return useQuery(
    [buildReviewDetailQueryKey(ctx.reviewSession.review.id)],
    () => {
      return reviewAPI.retrieveReviewDetail(
        ctx.reviewSession.workspace.id,
        ctx.reviewSession.review.id,
        props.host.pathname
      )
    }
  )
}
