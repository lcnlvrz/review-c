import type { User } from 'database'
import { createContext, useCallback, useContext, useState } from 'react'

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

interface ReviewContext {
  PORTAL_SHADOW_ID?: string
  auth: User
  reviewSession: ReviewSession
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
  auth: {
    id: 0,
    avatar: '',
    email: '',
    firstName: '',
    lastName: '',
  },
  reviewSession: {
    review: {
      id: '',
      title: '',
    },
    workspace: {
      id: '',
      name: '',
    },
  },
  PORTAL_SHADOW_ID: '',
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

export const ReviewProvider = (
  props: React.PropsWithChildren<{
    session: ReviewContext['reviewSession']
    auth: ReviewContext['auth']
    PORTAL_SHADOW_ID?: string
  }>
) => {
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

  const mustGetHtmlTag = useCallback(() => {
    const html = window.document.getElementsByTagName('html').item(0)

    if (!html) {
      throw new Error('html tag not found')
    }

    return html
  }, [])

  const focusCursor = useCallback(() => {
    setCursorFocused(true)

    const html = mustGetHtmlTag()

    html.style.cursor = 'none'
    html.style.userSelect = 'none'
    iterateOverSelectableElements('none')
  }, [])

  const blurCursor = useCallback(() => {
    setCursorFocused(false)

    const html = mustGetHtmlTag()

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
        PORTAL_SHADOW_ID: props.PORTAL_SHADOW_ID,
        auth: props.auth,
        reviewSession: props.session,
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
