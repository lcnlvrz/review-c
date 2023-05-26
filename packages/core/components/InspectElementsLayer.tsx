import { useInspectElements } from '../providers/InspectElementsProvider'
import { useReview } from '../providers/ReviewProvider'
import { getContentShadowDomRef } from '../utils/get-content-shadow-dom-ref'
import { AbsoluteContainer } from './AbsoluteContainer'
import { Portal } from '@radix-ui/react-portal'
import { cn, Dialog, DialogContent, Spinner } from 'ui'

export const InspectElementsLayer = () => {
  const ctx = useReview()
  const { inspectingElement, isLoading } = useInspectElements()
  const portal = getContentShadowDomRef(ctx.PORTAL_SHADOW_ID)

  const inspectElementsLayer = (
    <>
      <Dialog open={isLoading}>
        <DialogContent portalRef={portal} noClose className="sm:max-w-[425px]">
          <div className="grid gap-4 py-4">
            <div className="flex flex-row items-center justify-center">
              <Spinner />
              <p>Generando captura</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {inspectingElement && (
        <AbsoluteContainer
          id="inspect-elements"
          className={cn('bg-red-500 bg-opacity-50 pointer-events-none')}
          point={inspectingElement}
          style={{
            height: `${inspectingElement.height}px`,
            width: `${inspectingElement.width}px`,
          }}
        />
      )}
    </>
  )

  if (portal) {
    return <Portal container={portal}>{inspectElementsLayer}</Portal>
  }

  return inspectElementsLayer
}
