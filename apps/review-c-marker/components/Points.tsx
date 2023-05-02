import { Textarea } from './Textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import html2canvas from 'html2canvas'
import { Camera, MessageCircle, Plus, Send } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRowSelect } from 'react-table'
import { createContext } from 'vm'
import { useAuth } from '~hooks/useAuth'
import { useDisclosure } from '~hooks/useDisclosure'
import { fileToBase64 } from '~lib/file-to-base64'
import { getXPath } from '~lib/get-xpath'
import { queryDomElemXPath } from '~lib/query-dom-elem-xpath'
import { cn } from '~lib/utils'
import { useReview } from '~providers/ReviewProvider'
import { pointSchema, type PointSchema } from '~schemas/point.schema'

interface MarkerPoint {
  xpath: string
  xPercentage: number
  yPercentage: number
  top: number
  left: number
}

const Avatar = () => {
  const auth = useAuth()

  return (
    <div className="bg-white p-2 rounded-full shadow-lg border-gray-400 border">
      <MessageCircle className="-scale-x-1 text-primary" />
    </div>
  )
}

const InspectElements = (props: {
  onScreenshotTaken: (screenshot: File) => void
}) => {
  const [currentElement, setCurrentElement] = useState<{
    xPath: string
    top: number
    left: number
    width: number
    height: number
  }>()

  const isExtensionDOM = useCallback(
    (ele: HTMLElement) => ele.tagName.toLowerCase() === 'plasmo-csui',
    []
  )

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement

    if (isExtensionDOM(target)) {
      return
    }

    const xPath = getXPath(target)
    const rect = target.getBoundingClientRect()

    setCurrentElement({
      height: rect.height,
      width: rect.width,
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      xPath,
    })
  }, [])

  const takeScreenshot = useCallback((event: MouseEvent) => {
    if (isExtensionDOM(event.target as HTMLElement)) {
      return
    }

    html2canvas(event.target as HTMLElement).then((canvas) => {
      canvas.toBlob(async (blob) => {
        props.onScreenshotTaken(
          new File([blob], `screenshot-${new Date().getTime()}.png`)
        )
      })
    })
  }, [])

  useEffect(() => {
    window.addEventListener('click', takeScreenshot)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', takeScreenshot)
    }
  }, [])

  if (!currentElement) return null

  return (
    <>
      <div
        className="bg-red-500 bg-opacity-50"
        style={{
          pointerEvents: 'none',
          transform: `translate(${currentElement.left}px, ${currentElement.top}px)`,
          position: 'absolute',
          height: `${currentElement.height}px`,
          width: `${currentElement.width}px`,
        }}
      />
    </>
  )
}

const Point = (props: { left: number; top: number }) => {
  const auth = useAuth()

  return (
    <>
      <div
        style={{
          transform: `translate(${props.left}px, ${props.top}px)`,
        }}
        className={cn(`absolute z-1`)}
      >
        <div className="bg-white p-2 rounded-full shadow-lg border-gray-400 border">
          <MessageCircle className="-scale-x-1 text-primary" />
        </div>
      </div>
      <div
        style={{
          transform: `translate(${props.left + 25}px, ${props.top}px)`,
        }}
        className={cn(`absolute -z-10`)}
      >
        <Avatar />
      </div>
    </>
  )
}

const CommitPoint = (props: { stagedPoint?: MarkerPoint }) => {
  const ctx = useReview()
  const [screenshot, setScreenshot] = useState<string>()

  const isTakingScreenshotCtrl = useDisclosure()

  const methods = useForm<PointSchema>({
    resolver: zodResolver(pointSchema),
    defaultValues: {
      message: '',
      xpath: props.stagedPoint.xpath,
      xPercentage: props.stagedPoint.xPercentage,
      yPercentage: props.stagedPoint.yPercentage,
    },
  })

  const onTakeScreenshot = useCallback(() => {
    ctx.blurCursor()
    ctx.hideAbsoluteElements()
    isTakingScreenshotCtrl.onOpen()
  }, [])

  return (
    <div>
      {ctx.mustShowAbsoluteElements && (
        <div>
          <Point left={props.stagedPoint.left} top={props.stagedPoint.top} />
          <div
            style={{
              transform: `translate(${props.stagedPoint.left + 68}px, ${
                props.stagedPoint.top
              }px)`,
            }}
            className={cn(
              `absolute bg-white p-3 border-gray-400 min-w-full max-w-[20rem] border shadow-lg rounded-2xl`
            )}
          >
            <Textarea
              {...methods.register('message')}
              className="min-w-[15rem] h-24 border-none p-2 bg-white text-black focus:outline-0 text-sm focus:ring-0 focus:border-transparent resize-none"
            />

            <div className="w-full flex justify-between mt-5">
              <div className="flex flex-row items-center space-x-3">
                <button
                  title="Add files"
                  className="hover:bg-primary group rounded-full p-1 transition-all"
                >
                  <Plus className="text-gray-500 group-hover:text-white w-[20px] text-xs" />
                </button>
                <button
                  onClick={onTakeScreenshot}
                  title="Take a screenshot"
                  className="hover:bg-primary group rounded-full p-1 transition-all"
                >
                  <Camera className="text-gray-500 group-hover:text-white w-[20px] text-xs" />
                </button>
              </div>

              <button
                title="Send comment"
                className="hover:bg-primary rounded-full group p-1 transition-all "
              >
                <Send className="text-gray-500 w-[20px] text-xs group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isTakingScreenshotCtrl.isOpen && (
        <InspectElements
          onScreenshotTaken={(file) => {
            fileToBase64(file)
              .then(setScreenshot)
              .finally(() => {
                isTakingScreenshotCtrl.onClose()
              })
          }}
        />
      )}

      {screenshot && (
        <img
          style={{
            position: 'fixed',
            top: 0,
          }}
          src={screenshot}
        />
      )}
    </div>
  )
}

const CommitPointListener = (props: {
  stagedPoint?: MarkerPoint
  setStagedPoint: (point: MarkerPoint) => void
}) => {
  const ctx = useReview()
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
    ctx.blurCursor()
  }, [])

  useEffect(() => {
    window.addEventListener('click', handleMouseClick)

    return () => {
      window.removeEventListener('click', handleMouseClick)
    }
  }, [props.stagedPoint])

  if (!props.stagedPoint) return null

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
        <Textarea className="min-w-[15rem]  border-none p-2 bg-white text-black focus:outline-0 text-sm focus:ring-0 focus:border-transparent resize-none" />

        <div className="w-full flex justify-between mt-5">
          <div className="flex flex-row items-center space-x-3">
            <button
              title="Add files"
              className="hover:bg-primary group rounded-full p-1 transition-all"
            >
              <Plus className="text-gray-500 group-hover:text-white w-[20px] text-xs" />
            </button>
            <button
              title="Take a screenshot"
              className="hover:bg-primary group rounded-full p-1 transition-all"
            >
              <Camera className="text-gray-500 group-hover:text-white w-[20px] text-xs" />
            </button>
          </div>

          <button
            title="Send comment"
            className="hover:bg-primary rounded-full group p-1 transition-all "
          >
            <Send className="text-gray-500 w-[20px] text-xs group-hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

export const Points = () => {
  const [committedPoints, setCommittedPoints] = useState<MarkerPoint[]>([])
  const [stagedPoint, setStagedPoint] = useState<MarkerPoint>()

  const ctx = useReview()

  const recalculatePoint = useCallback((point: MarkerPoint) => {
    const node = queryDomElemXPath(point.xpath)

    if (!node) {
      console.log('not found node')
      return point
    }

    const rect = (node as HTMLElement).getBoundingClientRect()

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
      {ctx.cursorFocused && (
        <CommitPointListener
          stagedPoint={stagedPoint}
          setStagedPoint={(point) => setStagedPoint(point)}
        />
      )}

      {stagedPoint && <CommitPoint stagedPoint={stagedPoint} />}

      {committedPoints.map((p, index) => (
        <Point key={index} {...p} />
      ))}
    </div>
  )
}
