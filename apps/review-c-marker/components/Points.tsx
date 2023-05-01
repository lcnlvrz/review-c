import { MessageCircle, Plus, Send } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { getXPath } from '~lib/get-xpath'
import { cn } from '~lib/utils'

interface MarkerPoint {
  xpath: string
  xPercentage: number
  yPercentage: number
  top: number
  left: number
}

const Point = (props: { left: number; top: number }) => {
  return (
    <>
      <div
        style={{
          transform: `translate(${props.left}px, ${props.top}px)`,
        }}
        className={cn(`absolute`)}
      >
        <div className="bg-white p-2 rounded-full shadow-lg border-gray-400 border">
          <MessageCircle className="-scale-x-1" />
        </div>
      </div>
    </>
  )
}

const CommitPointListener = (props: {
  stagedPoint?: MarkerPoint
  setStagedPoint: (point: MarkerPoint) => void
}) => {
  const ref = useRef<HTMLDivElement>()

  const elementsOverlap = useCallback((a: HTMLElement, b: HTMLElement) => {
    const rectA = a.getBoundingClientRect()
    const rectB = b.getBoundingClientRect()

    return !(
      rectA.right < rectB.left ||
      rectA.left > rectB.right ||
      rectA.bottom < rectB.top ||
      rectA.top > rectB.bottom
    )
  }, [])

  const handleMouseClick = useCallback((event: MouseEvent) => {
    event.stopPropagation()

    if (ref.current) {
      const clickedOutside = !elementsOverlap(
        ref.current,
        event.target as HTMLElement
      )

      if (clickedOutside) {
        props.setStagedPoint(undefined)
        return
      }
    }

    const target = event.target as HTMLElement

    const path = getXPath(target)

    const rect = target.getBoundingClientRect()

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const point: MarkerPoint = {
      yPercentage: (y / rect.height) * 100,
      xPercentage: (x / rect.width) * 100,
      xpath: path,
      top: event.pageY,
      left: event.pageX,
    }

    props.setStagedPoint(point)
  }, [])

  useEffect(() => {
    window.addEventListener('click', handleMouseClick)

    return () => {
      window.removeEventListener('click', handleMouseClick)
    }
  }, [props.stagedPoint])

  if (props.stagedPoint) {
    return (
      <div>
        <Point left={props.stagedPoint.left} top={props.stagedPoint.top} />
        <div
          ref={ref}
          style={{
            transform: `translate(${props.stagedPoint.left + 45}px, ${
              props.stagedPoint.top
            }px)`,
          }}
          className={cn(
            `absolute bg-white p-3 border-gray-400 min-w-full max-w-[20rem] border shadow-lg rounded-2xl`
          )}
        >
          <textarea className="border-none focus:outline-0 text-sm focus:ring-0 focus:border-transparent resize-none" />
          <div className="w-full flex justify-between">
            <button className="hover:bg-gray-500 rounded-full transition-all">
              <Plus className="text-gray-300 w-[20px] text-xs" />
            </button>
            <button className="hover:bg-gray-500 rounded-full transition-all bg-primary">
              <Send className="text-gray-300 w-[20px] text-xs" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export const Points = (props: { isCursorFocused: boolean }) => {
  const [committedPoints, setCommittedPoints] = useState<MarkerPoint[]>([])
  const [stagedPoint, setStagedPoint] = useState<MarkerPoint>()

  const recalculatePoint = useCallback((point: MarkerPoint) => {
    const node = window.document.evaluate(
      point.xpath,
      window.document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE
    )

    if (!node.singleNodeValue) {
      console.log('not found node')
      return point
    }

    console.log('found node, calculating...')

    const rect = (node.singleNodeValue as HTMLElement).getBoundingClientRect()

    const top =
      rect.top + window.scrollY + (point.yPercentage * rect.height) / 100

    const left =
      rect.left + window.scrollX + (point.xPercentage * rect.width) / 100

    return {
      ...point,
      top,
      left,
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
  }, [committedPoints, stagedPoint])

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
      {props.isCursorFocused && (
        <CommitPointListener
          stagedPoint={stagedPoint}
          setStagedPoint={(point) => setStagedPoint(point)}
        />
      )}
      {committedPoints.map((p, index) => (
        <Point key={index} {...p} />
      ))}
    </div>
  )
}
