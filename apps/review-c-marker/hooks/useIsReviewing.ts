import { useCallback, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

export interface ReviewingState {
  hosts: string[]
}

export const useIsReviewing = (host: string) => {
  const [isReviewing, setIsReviewing] = useStorage(`reviewing:${host}`, false)

  const toggleReview = useCallback(
    async () => setIsReviewing(!isReviewing),
    [host, isReviewing]
  )

  return {
    isReviewing,
    toggleReview
  }
}
