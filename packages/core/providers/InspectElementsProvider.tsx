import { getXPath } from '../utils/get-xpath'
import { isExtensionDOM } from '../utils/is-extension-dom'
import { useReview } from './ReviewProvider'
import { createContext, useCallback, useContext, useState } from 'react'

interface InspectingElement {
  xPath: string
  top: number
  left: number
  width: number
  height: number
}

interface InspectElementsProvider {
  inspectElements: () => Promise<HTMLElement>
  inspectingElement?: InspectingElement
}

const InspectElementsContext = createContext<InspectElementsProvider>(null)

export const useInspectElements = () => useContext(InspectElementsContext)

export const InspectElementsProvider = (props: {
  children: React.ReactNode
}) => {
  const [currentElement, setCurrentElement] = useState<InspectingElement>()

  const ctx = useReview()

  const inspectElements = useCallback(() => {
    return new Promise<HTMLElement>((resolve, reject) => {
      ctx.hideAbsoluteElements()
      ctx.blurCursor()

      const handleMouseMove = (event: MouseEvent) => {
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
      }

      const onSelectElement = (event: MouseEvent) => {
        if (isExtensionDOM(event.target as HTMLElement)) {
          return
        }

        ctx.blurCursor()
        ctx.showAbsoluteElements()

        window.removeEventListener('click', onSelectElement)
        window.removeEventListener('mousemove', handleMouseMove)

        setCurrentElement(undefined)

        resolve(event.target as HTMLElement)
      }

      setTimeout(() => {
        window.addEventListener('click', onSelectElement)
        window.addEventListener('mousemove', handleMouseMove)
      }, 500)
    })
  }, [])

  return (
    <InspectElementsContext.Provider
      value={{
        inspectElements,
        inspectingElement: currentElement,
      }}
    >
      {props.children}
    </InspectElementsContext.Provider>
  )
}
