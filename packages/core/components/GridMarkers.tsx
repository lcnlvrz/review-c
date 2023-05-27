import { useReview } from '../providers/ReviewProvider'
import { createSafeNodeRange } from '../utils/create-safe-node-range'
import { queryDomElemXPath } from '../utils/query-dom-elem-xpath'
import { CommittedMarkerElement } from './CommittedMarkerElement'
import { MarkerPopulatedCalculated } from './MarkerElement'
import { StagedMarker, StagedMarkerListener } from './StagedMarker'
import type { ThreadPopulated } from 'common'
import { useCallback, useEffect, useState } from 'react'

export const TEXT_NODE_TYPE = 3

export interface StagedMarkerEle
  extends Omit<
    MarkerPopulatedCalculated,
    'threadId' | 'id' | 'pointId' | 'selectionId' | 'createdById'
  > {}

export const GridMarkers = (props: { threads: ThreadPopulated[] }) => {
  const [stagedMarker, setStagedMarker] = useState<StagedMarkerEle>()

  const [observer] = useState(
    () =>
      new MutationObserver(() => {
        setCommittedMarkers((markers) =>
          markers.map((marker) => recalculateMarker(marker))
        )
      })
  )

  const ctx = useReview()

  const iterateReviewThreads = useCallback(
    (threads: ThreadPopulated[] = []) =>
      threads.map((thread) => {
        return {
          ...recalculateMarker(thread.marker),
          messages: thread.messages,
          threadId: thread.id,
        }
      }),
    []
  )

  const recalculateMarker = useCallback(
    <
      T extends Omit<
        MarkerPopulatedCalculated<{}>,
        | 'messages'
        | 'threadId'
        | 'id'
        | 'createdById'
        | 'pointId'
        | 'selectionId'
      >
    >(
      marker: T
    ) => {
      switch (marker.type) {
        case 'point': {
          const { point, selection: _, ...rest } = marker

          const node = queryDomElemXPath(point.xPath)

          if (!node) {
            return {
              ...rest,
              point: {
                ...point,
                visible: false,
              },
            } as const
          }

          const rect = (node as HTMLElement).getBoundingClientRect()

          const top =
            rect.top +
            window.scrollY +
            (marker.point.yPercentage * rect.height) / 100

          const left =
            rect.left +
            window.scrollX +
            (marker.point.xPercentage * rect.width) / 100

          return {
            ...rest,
            point: {
              ...point,
              visible: true,
              top,
              left,
            },
          } as const
        }

        case 'selection': {
          const { selection, point: _, ...rest } = marker

          const node = queryDomElemXPath(selection.endContainerXPath)

          if (!node) {
            console.log(
              '[selection] not found nod with xpath',
              selection.endContainerXPath
            )

            return {
              ...rest,
              selection: {
                ...selection,
                visible: false,
              },
            } as const
          }

          const range = createSafeNodeRange(selection)
          const rects = range.getClientRects()

          const lastRect = rects[rects.length - 1]

          return {
            ...rest,
            selection: {
              ...selection,
              visible: true,
              top: lastRect.top + window.scrollY,
              left: lastRect.right + window.scrollX,
            },
          } as const
        }
      }
    },
    []
  )

  const [committedMarkers, setCommittedMarkers] = useState<
    MarkerPopulatedCalculated[]
  >(() => iterateReviewThreads(props.threads))

  useEffect(() => {
    setCommittedMarkers(iterateReviewThreads(props.threads))
  }, [props.threads])

  useEffect(() => {
    return () => {
      observer.disconnect()
    }
  }, [])

  const onLayoutChange = useCallback(() => {
    setCommittedMarkers((prev) => prev.map((p) => recalculateMarker(p)))

    setStagedMarker((marker) => {
      if (!marker) {
        return marker
      }

      return recalculateMarker(marker)
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onLayoutChange)
    window.addEventListener('resize', onLayoutChange)

    return () => {
      window.removeEventListener('resize', onLayoutChange)
      window.removeEventListener('scroll', onLayoutChange)
    }
  }, [])

  return (
    <div>
      <StagedMarkerListener
        stagedMarker={stagedMarker}
        setStagedMarker={setStagedMarker}
      />

      {stagedMarker && (
        <StagedMarker
          clearStagedPoint={() => setStagedMarker(undefined)}
          stagedMarker={stagedMarker}
        />
      )}

      {committedMarkers.map((marker, index) => (
        <CommittedMarkerElement
          threadId={marker.threadId}
          messages={marker.messages}
          marker={marker}
          key={index}
        />
      ))}
    </div>
  )
}
