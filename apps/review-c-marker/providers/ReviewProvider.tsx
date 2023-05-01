import { createContext, useCallback, useContext, useState } from 'react'

interface ReviewContext {
  cursorFocused: boolean
  focusCursor: () => void
  blurCursor: () => void
  toggleCursor: () => void
}

const ReviewContext = createContext<ReviewContext>({
  cursorFocused: false,
  blurCursor: () => {},
  focusCursor: () => {},
  toggleCursor: () => {},
})

export const useReview = () => useContext(ReviewContext)

export const ReviewProvider = (props: React.PropsWithChildren<{}>) => {
  const [cursorFocused, setCursorFocused] = useState(false)

  const iterateOverSelectableElements = useCallback(
    (pointerEvents: 'auto' | 'none') => {
      ;(['a', 'iframe'] as const).forEach((tagname) => {
        window.document.querySelectorAll(tagname).forEach((ele) => {
          ele.style.pointerEvents = pointerEvents
        })
      })
    },
    []
  )

  const focusCursor = useCallback(() => {
    setCursorFocused(true)

    const [html] = window.document.getElementsByTagName('html')

    html.style.cursor = 'none'
    html.style.userSelect = 'none'
    iterateOverSelectableElements('none')
  }, [])

  const blurCursor = useCallback(() => {
    setCursorFocused(false)

    const [html] = window.document.getElementsByTagName('html')

    html.style.cursor = 'auto'
    html.style.userSelect = 'auto'
    iterateOverSelectableElements('auto')
  }, [])

  const toggleCursor = useCallback(() => {
    if (cursorFocused) {
      blurCursor()
    }

    if (!cursorFocused) {
      focusCursor()
    }
  }, [cursorFocused])

  return (
    <ReviewContext.Provider
      value={{
        toggleCursor,
        blurCursor,
        focusCursor,
        cursorFocused,
      }}
    >
      {props.children}
    </ReviewContext.Provider>
  )
}
