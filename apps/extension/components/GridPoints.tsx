import { PointMarker, type MarkerPoint } from './PointMarker'
import { StagedPoint, StagedPointListener } from './StagedPoint'
import type { ThreadPopulated } from 'common'
import { useCallback, useEffect, useState } from 'react'
import { queryDomElemXPath } from '~lib/query-dom-elem-xpath'
import { useReview } from '~providers/ReviewProvider'

export const GridPoints = (props: { threads: ThreadPopulated[] }) => {
  const [stagedPoint, setStagedPoint] = useState<MarkerPoint>()

  const [observer] = useState(
    () =>
      new MutationObserver((mutations) => {
        setCommittedPoints((markers) =>
          markers.map((marker) => recalculatePoint(marker))
        )
      })
  )

  const ctx = useReview()

  const iterateReviewThreads = useCallback(
    (threads: ThreadPopulated[] = []) => {
      return threads.map((thread) => {
        const pointCalculated = recalculatePoint(thread.point)

        return {
          ...pointCalculated,
          messages: thread.messages,
          createdAt: thread.createdAt,
          threadId: thread.id,
        }
      })
    },
    []
  )

  const recalculatePoint = useCallback(
    <T extends Pick<MarkerPoint, 'xPath' | 'yPercentage' | 'xPercentage'>>(
      point: T
    ) => {
      const node = queryDomElemXPath(point.xPath)

      if (!node) {
        console.log('not found nod with xpath', point.xPath)
        return {
          ...point,
          visible: false,
        } as const
      }

      const rect = (node as HTMLElement).getBoundingClientRect()

      const top =
        rect.top + window.scrollY + (point.yPercentage * rect.height) / 100

      const left =
        rect.left + window.scrollX + (point.xPercentage * rect.width) / 100

      return {
        ...point,
        visible: true,
        top,
        left,
      } as const
    },
    []
  )

  const [committedPoints, setCommittedPoints] = useState<MarkerPoint[]>(() =>
    iterateReviewThreads(props.threads)
  )

  useEffect(() => {
    setCommittedPoints(iterateReviewThreads(props.threads))
    console.log('recalculated commited points!')
  }, [props.threads])

  useEffect(() => {
    return () => {
      observer.disconnect()
    }
  }, [])

  const onLayoutChange = useCallback(() => {
    setCommittedPoints((prev) => prev.map((p) => recalculatePoint(p)))

    setStagedPoint((point) => {
      if (!point) {
        return point
      }

      return recalculatePoint(point)
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
      {ctx.cursorFocused && (
        <StagedPointListener
          stagedPoint={stagedPoint}
          setStagedPoint={(point) => setStagedPoint(point)}
        />
      )}

      {stagedPoint && (
        <StagedPoint
          clearStagedPoint={() => setStagedPoint(undefined)}
          stagedPoint={stagedPoint}
        />
      )}

      {committedPoints
        .filter((c): c is Extract<MarkerPoint, { visible: true }> => c.visible)
        .map((p, index) => (
          <PointMarker point={p} messages={p.messages} key={index} />
        ))}
    </div>
  )
}
