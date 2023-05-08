import { useAPI } from './useAPI'
import { useQuery } from '@tanstack/react-query'
import { useReview } from '~providers/ReviewProvider'

export const buildReviewDetailQueryKey = (reviewId: string) => {
  return `review-${reviewId}`
}

export const useReviewDetail = () => {
  const reviewAPI = useAPI('review')
  const ctx = useReview()

  return useQuery(
    [buildReviewDetailQueryKey(ctx.reviewSession.review.id)],
    () => {
      return reviewAPI.retrieveReviewDetail(
        ctx.reviewSession.workspace.id,
        ctx.reviewSession.review.id
      )
    }
  )
}
