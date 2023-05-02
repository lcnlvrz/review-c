import { createContext, useCallback, useContext, useState } from 'react'

interface ReviewContext {
  inspectElements: boolean
  startInspectElements: () => void
  stopInspectElements: () => void
  cursorFocused: boolean
  focusCursor: () => void
  blurCursor: () => void
  toggleCursor: () => void
  mustShowAbsoluteElements: boolean
  hideAbsoluteElements: () => void
  showAbsoluteElements: () => void
}

const ReviewContext = createContext<ReviewContext>({
  inspectElements: false,
  cursorFocused: false,
  mustShowAbsoluteElements: true,
  stopInspectElements: () => {},
  startInspectElements: () => {},
  blurCursor: () => {},
  focusCursor: () => {},
  toggleCursor: () => {},
  hideAbsoluteElements: () => {},
  showAbsoluteElements: () => {},
})

export const useReview = () => useContext(ReviewContext)

export const ReviewProvider = (props: React.PropsWithChildren<{}>) => {
  const [cursorFocused, setCursorFocused] = useState(false)
  const [inspectElements, setInspectElements] = useState(false)

  const [mustShowAbsoluteElements, setMustShowAbsoluteElements] = useState(true)

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

  const hideAbsoluteElements = useCallback(() => {
    setMustShowAbsoluteElements(false)
  }, [])

  const showAbsoluteElements = useCallback(() => {
    setMustShowAbsoluteElements(true)
  }, [])

  const toggleCursor = useCallback(() => {
    if (cursorFocused) {
      blurCursor()
    }

    if (!cursorFocused) {
      focusCursor()
    }
  }, [cursorFocused])

  const startInspectElements = useCallback(() => {
    setInspectElements(true)
  }, [])

  const stopInspectElements = useCallback(() => {
    setInspectElements(false)
  }, [])

  return (
    <ReviewContext.Provider
      value={{
        stopInspectElements,
        startInspectElements,
        inspectElements,
        mustShowAbsoluteElements,
        hideAbsoluteElements,
        showAbsoluteElements,
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