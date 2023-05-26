import { useInspectElements } from '../providers/InspectElementsProvider'
import { useReview } from '../providers/ReviewProvider'
import { getContentShadowDomRef } from '../utils/get-content-shadow-dom-ref'
import { AbsoluteContainer } from './AbsoluteContainer'
import { Portal } from '@radix-ui/react-portal'

export const InspectElementsLayer = () => {
  const ctx = useReview()
  const { inspectingElement } = useInspectElements()
  const portal = getContentShadowDomRef(ctx.PORTAL_SHADOW_ID)

  if (!inspectingElement) {
    return undefined
  }

  const inspectElementsLayer = (
    <AbsoluteContainer
      id="inspect-elements"
      className="bg-red-500 bg-opacity-50 pointer-events-none"
      point={inspectingElement}
      style={{
        height: `${inspectingElement.height}px`,
        width: `${inspectingElement.width}px`,
      }}
    />
  )

  if (portal) {
    return <Portal container={portal}>{inspectElementsLayer}</Portal>
  }

  return inspectElementsLayer
}
