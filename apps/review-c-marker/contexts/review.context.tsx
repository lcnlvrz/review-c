import { createContext, useCallback, useContext, useState } from "react"

interface ReviewContext {
  isReviewing: boolean
  startReviewing: () => void
}

const ReviewContext = createContext({} as ReviewContext)

export const useReview = () => useContext(ReviewContext)

export const ReviewProvider = (props: React.PropsWithChildren<{}>) => {
  const [isReviewing, setIsReviewing] = useState(false)

  const startReviewing = useCallback(() => setIsReviewing(true), [])

  return (
    <ReviewContext.Provider value={{ isReviewing, startReviewing }}>
      {props.children}
    </ReviewContext.Provider>
  )
}
