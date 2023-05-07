import { useCallback, useEffect, useState } from 'react'
import { getXPath } from '~lib/get-xpath'
import { isExtensionDOM } from '~lib/is-extension-dom'

export const InspectElements = (props: {
  onSelectElement: (event: MouseEvent) => void
}) => {
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

  useEffect(() => {
    window.addEventListener('click', props.onSelectElement)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', props.onSelectElement)
    }
  }, [])

  if (!currentElement) return null

  return (
    <>
      <div
        className="bg-red-500 bg-opacity-50"
        style={{
          pointerEvents: 'none',
          transform: `translate(${currentElement.left}px, ${currentElement.top}px)`,
          position: 'absolute',
          height: `${currentElement.height}px`,
          width: `${currentElement.width}px`,
        }}
      />
    </>
  )
}
