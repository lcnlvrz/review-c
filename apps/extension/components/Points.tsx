import { ImageGallery } from './ImageGallery'
import { InspectElements } from './InspectElements'
import { MarkerAvatar } from './MarkerAvatar'
import { Textarea } from './Textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Camera, MessageCircle, Plus, Send } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Thread } from '~../../packages/common'
import { useAPI } from '~hooks/useAPI'
import { useAuth } from '~hooks/useAuth'
import { useDisclosure } from '~hooks/useDisclosure'
import { buildReviewDetailQueryKey } from '~hooks/useReviewDetail'
import { useScreenshot } from '~hooks/useScreenshot'
import { getXPath } from '~lib/get-xpath'
import { isExtensionDOM } from '~lib/is-extension-dom'
import { queryDomElemXPath } from '~lib/query-dom-elem-xpath'
import { cn } from '~lib/utils'
import { useReview } from '~providers/ReviewProvider'
import { pointSchema, type PointSchema } from '~schemas/point.schema'

type MarkerPoint =
  | {
      visible: true
      xpath: string
      xPercentage: number
      yPercentage: number
      top: number
      left: number
    }
  | {
      visible: false
      xpath: string
      xPercentage: number
      yPercentage: number
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
        <MarkerAvatar />
      </div>
    </>
  )
}

const CommitPoint = (props: {
  stagedPoint: MarkerPoint
  clearStagedPoint: () => void
}) => {
  const ctx = useReview()

  const [isLoading, setIsLoading] = useState(false)

  const {
    takeScreenshot,
    removeScreenshot,
    screenshots,
    uploadScreenshot,
    addScreenshot,
  } = useScreenshot()

  const methods = useForm<PointSchema>({
    resolver: zodResolver(pointSchema),
    defaultValues: {
      message: '',
      xpath: props.stagedPoint.xpath,
      xPercentage: props.stagedPoint.xPercentage,
      yPercentage: props.stagedPoint.yPercentage,
    },
  })

  const reviewAPI = useAPI('review')

  const queryClient = useQueryClient()

  const inspectElementsCtrl = useDisclosure()

  const startInspectingElements = useCallback(() => {
    ctx.blurCursor()
    ctx.hideAbsoluteElements()
    inspectElementsCtrl.onOpen()
  }, [])

  const stopInspectingElements = useCallback(() => {
    ctx.blurCursor()
    ctx.showAbsoluteElements()
    inspectElementsCtrl.onClose()
  }, [])

  const onUploadImage = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files?.length) {
        const images = Array.from(event.target.files).filter((file) =>
          file.type.includes('image')
        )

        await Promise.all(
          images.map(async (image) => {
            addScreenshot({
              isLoading: true,
              progress: 0,
              name: image.name,
              src: URL.createObjectURL(image),
              token: '',
            })

            await uploadScreenshot(image)
          })
        )
      }
    },
    []
  )

  const onStartThread = useCallback(
    (data: PointSchema) => {
      setIsLoading(true)

      reviewAPI
        .startThread(
          ctx.reviewSession.workspace.id,
          ctx.reviewSession.review.id,
          {
            yPercentage: props.stagedPoint.yPercentage,
            xPercentage: props.stagedPoint.xPercentage,
            xPath: props.stagedPoint.xpath,
            files: screenshots.map((screenshot) => screenshot.token),
            message: data.message,
          }
        )
        .then(() => {
          queryClient.invalidateQueries([
            buildReviewDetailQueryKey(ctx.reviewSession.review.id),
          ])

          props.clearStagedPoint()
        })
        .finally(() => setIsLoading(false))
    },
    [ctx.reviewSession, screenshots.length]
  )

  return (
    <div>
      {ctx.mustShowAbsoluteElements && props.stagedPoint.visible && (
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
              className="min-w-[15rem] h-28 border-none p-2 bg-white text-black focus:outline-0 text-sm focus:ring-0 focus:border-transparent resize-none"
            />

            <ImageGallery onRemove={removeScreenshot} images={screenshots} />

            <div className="w-full flex justify-between mt-5">
              <div className="flex flex-row items-center space-x-3">
                <div className="relative group cursor-pointer">
                  <div className="absolute top-0 cursor-pointer">
                    <input
                      accept="image/*"
                      className="opacity-0 w-full cursor-pointer"
                      id="file"
                      type="file"
                      multiple
                      onChange={onUploadImage}
                    />
                  </div>

                  <button
                    onClick={removeScreenshot}
                    title="Add files"
                    className="group-hover:bg-primary group rounded-full p-1 transition-all"
                  >
                    <Plus className="text-gray-500 group-hover:text-white w-[20px] text-xs" />
                  </button>
                </div>

                <button
                  onClick={startInspectingElements}
                  title="Take a screenshot"
                  className="hover:bg-primary group rounded-full p-1 transition-all"
                >
                  <Camera className="text-gray-500 group-hover:text-white w-[20px] text-xs" />
                </button>
              </div>

              <button
                onClick={() => onStartThread(methods.getValues())}
                disabled={
                  screenshots.some((s) => s.isLoading) ||
                  methods.formState.isSubmitting
                }
                title="Send comment"
                className="hover:bg-primary rounded-full group p-1 transition-all "
              >
                <Send className="text-gray-500 w-[20px] text-xs group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {inspectElementsCtrl.isOpen && (
        <InspectElements
          onSelectElement={(event) => {
            if (isExtensionDOM(event.target as HTMLElement)) {
              return
            }

            stopInspectingElements()

            takeScreenshot(event.target as HTMLElement)
          }}
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
      visible: true,
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

  if (!props.stagedPoint || !props.stagedPoint.visible) return null

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

export const Points = (props: { threads: Thread[] }) => {
  const [stagedPoint, setStagedPoint] = useState<MarkerPoint>()

  const ctx = useReview()

  const iterateReviewThreads = useCallback((threads: Thread[] = []) => {
    return threads.map((t) =>
      recalculatePoint({
        xpath: t.xPath,
        xPercentage: t.xPercentage,
        yPercentage: t.yPercentage,
      })
    )
  }, [])

  const recalculatePoint = useCallback(
    <T extends Omit<MarkerPoint, 'left' | 'top' | 'visible'>>(point: T) => {
      const node = queryDomElemXPath(point.xpath)

      if (!node) {
        console.log('not found nod with xpath', point.xpath)
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
  }, [props.threads.length])

  useEffect(() => {
    const interval = setInterval(() => {
      setCommittedPoints((markers) =>
        markers.map((marker) => recalculatePoint(marker))
      )
    }, 2000)

    return () => {
      clearInterval(interval)
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
        <CommitPointListener
          stagedPoint={stagedPoint}
          setStagedPoint={(point) => setStagedPoint(point)}
        />
      )}

      {stagedPoint && (
        <CommitPoint
          clearStagedPoint={() => setStagedPoint(undefined)}
          stagedPoint={stagedPoint}
        />
      )}

      {committedPoints.map((p, index) => {
        if (p.visible) {
          return <Point key={index} {...p} />
        }

        return null
      })}
    </div>
  )
}
