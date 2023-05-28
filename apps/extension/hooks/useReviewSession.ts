import { useStorage } from '@plasmohq/storage/hook'
import { useCallback } from 'react'

export interface ReviewingState {
  hosts: string[]
}

export interface ReviewSession {
  review: {
    id: string
    title: string
  }
  workspace: {
    id: string
    name: string
  }
}

export const useReviewSession = (host: string) => {
  const [currentReviewSession, setIsReviewing, { remove }] =
    useStorage<ReviewSession>(`review-session:${host}`)

  const startReviewSession = useCallback(
    (review: ReviewSession) => setIsReviewing(review),
    []
  )

  const stopReviewSession = useCallback(() => remove(), [])

  return {
    currentReviewSession,
    startReviewSession,
    stopReviewSession,
  }
}
