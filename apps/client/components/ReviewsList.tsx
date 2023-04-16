import type { ListReviewsOutput } from '@/../../packages/common'
import { currentWorkspaceAtom } from '@/atoms/pageProps'
import { REVIEWS_QUERY_KEY } from '@/constants/query-keys'
import { ReviewService } from '@/services/review.service'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import React from 'react'

export const ReviewsList = (props: {
  reviews: ListReviewsOutput['reviews']
}) => {
  const currentWorkspace = useAtomValue(currentWorkspaceAtom)

  const { isLoading, data, error } = useQuery(
    [REVIEWS_QUERY_KEY],
    () =>
      ReviewService.listReviews(currentWorkspace.id).then((res) => res.reviews),
    {
      retry: 1,
      initialData: props.reviews,
    }
  )

  console.log('data', data)

  return <div>ReviewsList</div>
}
