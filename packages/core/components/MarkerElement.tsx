import { useReview } from '../providers/ReviewProvider'
import { createSafeNodeRange } from '../utils/create-safe-node-range'
import { getContentShadowDomRef } from '../utils/get-content-shadow-dom-ref'
import { queryDomElemXPath } from '../utils/query-dom-elem-xpath'
import { AbsoluteContainer } from './AbsoluteContainer'
import { StagedMarkerEle, TEXT_NODE_TYPE } from './GridMarkers'
import { MarkerAvatar } from './MarkerAvatar'
import {
  composeUserName,
  MarkerPopulated,
  PointPopulated,
  type MessagePopulated,
} from 'common'
import { Selection } from 'database'
import { MessageCircle } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'

export type PointCoordinates =
  | {
      visible: false
    }
  | {
      visible: true
      left: number
      top: number
    }

export interface MarkerPopulatedCalculated<T extends object = PointCoordinates>
  extends Omit<MarkerPopulated, 'point' | 'selection'> {
  threadId: number
  messages: MessagePopulated[]
  point?: Omit<PointPopulated, 'id'> & T
  selection?: Omit<Selection, 'id'> & T
}

interface SelectionHighlight {
  top: number
  left: number
  width: number
  height: number
}

const SelectionHighlights = (
  props: Pick<MarkerPopulatedCalculated, 'selection'>
) => {
  const [selectionHighlights, setSelectionHighlights] = useState<
    SelectionHighlight[]
  >([])

  useEffect(() => {
    const highlights: SelectionHighlight[] = []

    const range = createSafeNodeRange(props.selection)

    console.log('range highlight', range)

    const rects = range.getClientRects()

    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i]

      highlights.push({
        height: rect.height,
        width: rect.width,
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      })
    }

    setSelectionHighlights(highlights)
  }, [props.selection])

  console.log('highlights', selectionHighlights)

  return (
    <div className="selection-highlights">
      {selectionHighlights.map((highlight, index) => {
        return (
          <AbsoluteContainer
            className="bg-black/10 pointer-events-none"
            key={index}
            point={highlight}
            style={{
              width: highlight.width,
              height: highlight.height,
            }}
          />
        )
      })}
    </div>
  )
}

export const MarkerElement = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    threadId?: number
    marker: StagedMarkerEle
    messages: MessagePopulated[]
  }
>(({ threadId, marker, messages, ...props }, ref) => {
  const ctx = useReview()

  const point = marker[marker.type]

  if (!point.visible || !ctx.mustShowAbsoluteElements) return null

  return (
    <div>
      {marker.type === 'selection' && (
        <SelectionHighlights selection={marker.selection} />
      )}

      {ctx.mustShowAbsoluteElements && (
        <div>
          <AbsoluteContainer
            {...props}
            ref={ref}
            point={point}
            className="z-20"
          >
            <div className="bg-white p-2 rounded-full shadow-lg border-gray-400 border">
              <MessageCircle className="-scale-x-1 text-primary" />
            </div>
          </AbsoluteContainer>
          <AbsoluteContainer
            point={{
              left: point.left + 25,
              top: point.top,
            }}
            className="z-30"
          >
            <MarkerAvatar
              src={marker.createdBy.avatar}
              name={composeUserName(marker.createdBy)}
            />
          </AbsoluteContainer>
        </div>
      )}
    </div>
  )
})
