import { InspectElements } from './InspectElements'
import { MessageContainer } from './Message'
import { MessageInput } from './MessageInput'
import { PointMarker, type MarkerPoint } from './PointMarker'
import { Textarea } from './Textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Camera, Plus, Send } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getUserAgentSpecs } from '~../../packages/common'
import { useAPI } from '~hooks/useAPI'
import { useDisclosure } from '~hooks/useDisclosure'
import { buildReviewDetailQueryKey } from '~hooks/useReviewDetail'
import { useScreenshot } from '~hooks/useScreenshot'
import { getXPath } from '~lib/get-xpath'
import { cn } from '~lib/utils'
import { useReview } from '~providers/ReviewProvider'
import { pointSchema, type PointSchema } from '~schemas/point.schema'

dayjs.extend(relativeTime)

export const StagedPoint = (props: {
  stagedPoint: MarkerPoint
  clearStagedPoint: () => void
}) => {
  const ctx = useReview()

  const [isLoading, setIsLoading] = useState(false)

  const screenshotsCtrl = useScreenshot()

  const methods = useForm<PointSchema>({
    resolver: zodResolver(pointSchema),
    defaultValues: {
      message: '',
      xpath: props.stagedPoint.xPath,
      xPercentage: props.stagedPoint.xPercentage,
      yPercentage: props.stagedPoint.yPercentage,
    },
  })

  const reviewAPI = useAPI('review')

  const queryClient = useQueryClient()

  const inspectElementsCtrl = useDisclosure()

  const onStartThread = useCallback(
    (data: PointSchema) => {
      setIsLoading(true)

      reviewAPI
        .startThread(
          ctx.reviewSession.workspace.id,
          ctx.reviewSession.review.id,
          {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            yPercentage: props.stagedPoint.yPercentage,
            xPercentage: props.stagedPoint.xPercentage,
            xPath: props.stagedPoint.xPath,
            files: screenshotsCtrl.screenshots.map(
              (screenshot) => screenshot.token
            ),
            message: data.message,
            pathname: window.location.pathname,
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
    [ctx.reviewSession, screenshotsCtrl.screenshots.length]
  )

  return (
    <div>
      {ctx.mustShowAbsoluteElements && props.stagedPoint.visible && (
        <div>
          <PointMarker messages={[]} point={props.stagedPoint} isStagedPoint />
          <div
            style={{
              transform: `translate(${props.stagedPoint.left + 68}px, ${
                props.stagedPoint.top
              }px)`,
            }}
            className="absolute"
          >
            <MessageContainer>
              <MessageInput
                className="rounded-t-2xl !p-3"
                onSubmit={onStartThread}
                formCtrl={methods}
                inspectElementsCtrl={inspectElementsCtrl}
                point={props.stagedPoint}
                screenshotsCtrl={screenshotsCtrl}
              />
            </MessageContainer>
          </div>
        </div>
      )}

      {inspectElementsCtrl.isOpen && (
        <InspectElements
          onClose={inspectElementsCtrl.onClose}
          onSelectElement={screenshotsCtrl.takeScreenshot}
        />
      )}
    </div>
  )
}

export const StagedPointListener = (props: {
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
    console.log('mouse click!', event)

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

    const xPath = getXPath(target)

    const rect = target.getBoundingClientRect()

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const specs = getUserAgentSpecs(navigator.userAgent)

    if (isSpecsClientSide(specs)) {
      const point: MarkerPoint = {
        ...specs,
        xPath,
        visible: true,
        yPercentage: (y / rect.height) * 100,
        xPercentage: (x / rect.width) * 100,
        top: event.pageY,
        left: event.pageX,
        createdBy: ctx.auth,
        messages: [],
        createdAt: new Date(),
      }

      props.setStagedPoint(point)
      ctx.blurCursor()
    }
  }, [])

  const isSpecsClientSide = (
    specs: ReturnType<typeof getUserAgentSpecs>
  ): specs is Required<ReturnType<typeof getUserAgentSpecs>> => {
    return (
      typeof specs.windowHeight === 'number' &&
      typeof specs.windowWidth === 'number'
    )
  }

  useEffect(() => {
    window.addEventListener('click', handleMouseClick)

    return () => {
      window.removeEventListener('click', handleMouseClick)
    }
  }, [props.stagedPoint])

  if (!props.stagedPoint || !props.stagedPoint.visible) return null

  return (
    <div>
      <PointMarker messages={[]} point={props.stagedPoint} isStagedPoint />
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
