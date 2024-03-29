import { getXPath } from '../utils/get-xpath'
import { isExtensionDOM } from '../utils/is-extension-dom'
import { useReview } from './ReviewProvider'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

interface InspectingElement {
  xPath: string
  top: number
  left: number
  width: number
  height: number
}

type InspectElementsFn = () => Promise<HTMLElement>

interface InspectElementsProvider {
  isLoading?: boolean
  inspectElements: InspectElementsFn
  inspectingElement?: InspectingElement
}

const InspectElementsContext = createContext<InspectElementsProvider>(null)

export const useInspectElements = () => useContext(InspectElementsContext)

export const InspectElementsProvider = (props: {
  children: React.ReactNode
}) => {
  const [inspectingElement, setInspectingElement] =
    useState<InspectingElement>()

  const [isLoading, setIsLoading] = useState(false)

  const ctx = useReview()

  const inspectElements: InspectElementsFn = useCallback(() => {
    return new Promise((resolve) => {
      ctx.hideAbsoluteElements()
      ctx.blurCursor()

      const handleMouseMove = (event: MouseEvent) => {
        const target = event.target as HTMLElement

        if (isExtensionDOM(target)) {
          return
        }

        const xPath = getXPath(target)
        const rect = target.getBoundingClientRect()

        setInspectingElement({
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

        setInspectingElement(undefined)
        setIsLoading(false)

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
        isLoading,
        inspectElements,
        inspectingElement,
      }}
    >
      {props.children}
    </InspectElementsContext.Provider>
  )
}
