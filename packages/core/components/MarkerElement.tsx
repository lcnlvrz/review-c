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
import { useCallback, useEffect, useState } from 'react'

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

  return (
    <div className="selection-highlights">
      {selectionHighlights.map((highlight, index) => {
        return (
          <div
            key={index}
            className="absolute bg-black/10 pointer-events-none"
            style={{
              width: highlight.width,
              height: highlight.height,
              top: highlight.top,
              left: highlight.left,
            }}
          />
        )
      })}
    </div>
  )
}

export const MarkerElement = (props: {
  threadId?: number
  marker: StagedMarkerEle
  messages: MessagePopulated[]
}) => {
  const ctx = useReview()

  const point = props.marker[props.marker.type]

  if (!point.visible) return

  return (
    <div>
      {props.marker.type === 'selection' && (
        <SelectionHighlights selection={props.marker.selection} />
      )}
      {ctx.mustShowAbsoluteElements && (
        <div>
          <AbsoluteContainer point={point}>
            <div className="bg-white p-2 rounded-full shadow-lg border-gray-400 border">
              <MessageCircle className="-scale-x-1 text-primary" />
            </div>
          </AbsoluteContainer>
          <AbsoluteContainer
            point={{
              left: point.left + 25,
              top: point.top,
            }}
          >
            <MarkerAvatar
              src={props.marker.createdBy.avatar}
              name={composeUserName(props.marker.createdBy)}
            />
          </AbsoluteContainer>
        </div>
      )}
    </div>
  )
}
