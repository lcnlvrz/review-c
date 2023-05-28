import { useDisclosure } from '../hooks/useDisclosure'
import { useFloatingMarker } from '../hooks/useFloatingMarker'
import { useReview } from '../providers/ReviewProvider'
import { getContentShadowDomRef } from '../utils/get-content-shadow-dom-ref'
import { AbsoluteContainer } from './AbsoluteContainer'
import { MarkerElement, MarkerPopulatedCalculated } from './MarkerElement'
import { MessageContent } from './Message'
import { Thread } from './Thread'
import { discriminateMessages } from 'common'
import React, { useEffect } from 'react'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  cn,
  TooltipContent,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from 'ui'

export const CommittedMarkerElement = (
  props: Omit<React.ComponentProps<typeof MarkerElement>, 'marker'> & {
    marker: MarkerPopulatedCalculated
  }
) => {
  const popover = useDisclosure()
  const tooltip = useDisclosure()

  const ctx = useReview()

  const point = props.marker[props.marker.type]

  const { starterMessage } = discriminateMessages(props.messages)

  const { floating } = useFloatingMarker(point)

  if (!point.visible) return

  return (
    <div>
      <MarkerElement {...props} ref={floating.refs.setReference} />
      <TooltipProvider>
        <Tooltip
          onOpenChange={tooltip.setIsOpen}
          open={
            popover.isOpen || !ctx.mustShowAbsoluteElements
              ? false
              : tooltip.isOpen
          }
          delayDuration={0}
        >
          <TooltipTrigger asChild>
            <AbsoluteContainer className={cn(`z-40 h-10 w-20`)} point={point} />
          </TooltipTrigger>
          <TooltipContent
            className={'border border-gray-200 rounded-2xl w-96 p-4'}
            asChild
          >
            <MessageContent
              onClick={() => {
                popover.onOpen()
                tooltip.onClose()
              }}
              className="cursor-pointer"
              message={starterMessage}
            />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Popover
        open={popover.isOpen}
        onOpenChange={(open) => {
          console.log('open', open)

          if (!ctx.mustShowAbsoluteElements) return

          popover.setIsOpen(open)
          tooltip.onClose()
        }}
      >
        <PopoverTrigger asChild>
          <AbsoluteContainer className={cn(`z-1 h-10 w-10`)} point={point} />
        </PopoverTrigger>

        <PopoverContent
          className="border-none outline-none p-0 w-full"
          container={getContentShadowDomRef(ctx.PORTAL_SHADOW_ID)}
        >
          <Thread
            marker={props.marker}
            startedById={props.marker.createdBy.id}
            threadId={props.threadId}
            messages={props.messages}
            point={point}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
