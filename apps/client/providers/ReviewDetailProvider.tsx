import { useCurrentWorkspace } from '@/atoms/pageProps'
import { ReviewService } from '@/services/review.service'
import { useQuery } from '@tanstack/react-query'
import type { RetrieveReviewDetailOutput } from 'common'
import { createContext, useContext } from 'react'

interface ReviewDetailContext {
  review: RetrieveReviewDetailOutput
}

const ReviewDetailContext = createContext<ReviewDetailContext>({
  review: {} as any,
})

export const useReviewDetail = () => useContext(ReviewDetailContext).review

export const buildReviewDetailQueryKey = (id: string) => `review-detail-${id}`

export const ReviewDetailProvider = (
  props: React.PropsWithChildren<ReviewDetailContext>
) => {
  const workspace = useCurrentWorkspace()

  const { data } = useQuery(
    [buildReviewDetailQueryKey(props.review.id)],
    () => ReviewService.detail(workspace.id, props.review.id),
    {
      initialData: props.review,
    }
  )

  return (
    <ReviewDetailContext.Provider
      value={{
        review: data,
      }}
    >
      {props.children}
    </ReviewDetailContext.Provider>
  )
}
