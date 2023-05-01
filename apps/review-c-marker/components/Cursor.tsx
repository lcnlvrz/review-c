import cursor from 'data-base64:~assets/icon.png'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getXPath } from '~lib/get-xpath'

const evaluator = new XPathEvaluator()

interface MarkerPoint {
  xpath: string
  xPercentage: number
  yPercentage: number
  top: number
  left: number
}

export const Cursor = () => {
  const ref = useRef<HTMLImageElement>(null)
  const [points, setPoints] = useState<MarkerPoint[]>([])

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = `${event.clientX}px`
        ref.current.style.top = `${event.clientY}px`
      }
    },
    [ref]
  )

  const handleMouseClick = useCallback((event: MouseEvent) => {
    event.stopPropagation()
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

    setPoints((prev) => prev.concat([point]))
  }, [])

  const recalculatePoints = useCallback(() => {
    setPoints((prev) =>
      prev.map((p) => {
        const node = window.document.evaluate(
          p.xpath,
          window.document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE
        )

        const rect = (
          node.singleNodeValue as HTMLElement
        ).getBoundingClientRect()

        const top =
          rect.top + window.scrollY + (p.yPercentage * rect.height) / 100

        const left =
          rect.left + window.scrollX + (p.xPercentage * rect.width) / 100

        return {
          ...p,
          top,
          left,
        }
      })
    )
  }, [points])

  useEffect(() => {
    window.addEventListener('resize', recalculatePoints)
    window.addEventListener('click', handleMouseClick)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleMouseClick)
      window.removeEventListener('resize', recalculatePoints)
    }
  }, [])

  console.log('points', points)

  return (
    <div>
      <div
        style={{
          pointerEvents: 'none',
        }}
        className="fixed"
        ref={ref}
      >
        <img className="w-[30px] h-[30px]" src={cursor} />
      </div>
      <div>
        {points.map((p, index) => {
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: p.top,
                left: p.left,
              }}
            >
              <p>text goes here!</p>
              {/* <img src={cursor} className="w-[30px] h-[30px]" /> */}
            </div>
          )
        })}
      </div>
    </div>
  )
}
