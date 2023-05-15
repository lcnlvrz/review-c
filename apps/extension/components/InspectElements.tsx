import { Portal } from '@radix-ui/react-portal'
import { useCallback, useEffect, useState } from 'react'
import { getContentShadowDomRef } from '~lib/get-content-shadow-dom-ref'
import { getXPath } from '~lib/get-xpath'
import { isExtensionDOM } from '~lib/is-extension-dom'
import { useReview } from '~providers/ReviewProvider'

export const InspectElements = (props: {
  onClose: () => void
  onSelectElement: (element: HTMLElement) => void
}) => {
  const ctx = useReview()

  const [currentElement, setCurrentElement] = useState<{
    xPath: string
    top: number
    left: number
    width: number
    height: number
  }>()

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement

    if (isExtensionDOM(target)) {
      return
    }

    const xPath = getXPath(target)
    const rect = target.getBoundingClientRect()

    setCurrentElement({
      height: rect.height,
      width: rect.width,
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      xPath,
    })
  }, [])

  const onSelectElement = useCallback((event: MouseEvent) => {
    if (isExtensionDOM(event.target as HTMLElement)) {
      return
    }

    ctx.blurCursor()
    ctx.showAbsoluteElements()

    props.onSelectElement(event.target as HTMLElement)
    props.onClose()
  }, [])

  useEffect(() => {
    window.addEventListener('click', onSelectElement)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', onSelectElement)
    }
  }, [])

  const portal = getContentShadowDomRef()

  if (!currentElement) return null

  return (
    <Portal container={portal}>
      <div
        id="inspect-elements"
        className="bg-red-500 bg-opacity-50"
        style={{
          pointerEvents: 'none',
          transform: `translate(${currentElement.left}px, ${currentElement.top}px)`,
          position: 'absolute',
          height: `${currentElement.height}px`,
          width: `${currentElement.width}px`,
        }}
      />
    </Portal>
  )
}
