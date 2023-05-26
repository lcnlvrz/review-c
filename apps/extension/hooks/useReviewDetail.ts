import { useQuery } from '@tanstack/react-query'
import { useReview, useAPI, buildReviewDetailQueryKey } from 'core'
import type { Host } from '~lib/resolve-host'

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
