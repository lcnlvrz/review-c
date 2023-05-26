import { useAPI } from '../hooks/useAPI'
import { useScreenshot } from '../hooks/useScreenshot'
import { useReview } from '../providers/ReviewProvider'
import { PointSchema, pointSchema } from '../schemas/point.schema'
import { getContentShadowDomRef } from '../utils/get-content-shadow-dom-ref'
import { getXPath } from '../utils/get-xpath'
import { buildReviewDetailQueryKey } from '../utils/query-key-builders'
import { AbsoluteContainer } from './AbsoluteContainer'
import { CURSOR_ID } from './Cursor'
import { MessageContainer } from './Message'
import { MessageInput } from './MessageInput'
import { PointMarker, type MarkerPoint } from './PointMarker'
import { TOOLKIT_CONTAINER_ID } from './Toolkit'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { getUserAgentSpecs } from 'common'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { cn } from 'ui'

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

  if (!props.stagedPoint.visible) return

  return (
    <div
      className={cn({
        hidden: !ctx.mustShowAbsoluteElements,
      })}
    >
      <PointMarker messages={[]} point={props.stagedPoint} isStagedPoint />
      <AbsoluteContainer
        point={{
          top: props.stagedPoint.top,
          left: props.stagedPoint.left + 68,
        }}
      >
        <MessageContainer>
          <MessageInput
            className="rounded-t-2xl !p-3"
            onSubmit={onStartThread}
            formCtrl={methods}
            point={props.stagedPoint}
            screenshotsCtrl={screenshotsCtrl}
          />
        </MessageContainer>
      </AbsoluteContainer>
    </div>
  )
}

export const StagedPointListener = (props: {
  stagedPoint?: MarkerPoint
  setStagedPoint: (point: MarkerPoint) => void
}) => {
  const ctx = useReview()

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

    const toolkitContainer = ctx.PORTAL_SHADOW_ID
      ? getContentShadowDomRef(TOOLKIT_CONTAINER_ID)
      : window.document.getElementById(TOOLKIT_CONTAINER_ID)

    const cursor = ctx.PORTAL_SHADOW_ID
      ? getContentShadowDomRef(CURSOR_ID)
      : window.document.getElementById(CURSOR_ID)

    const clickedToolkit = elementsOverlap(toolkitContainer, cursor)

    if (clickedToolkit) {
      console.log('clicked toolkit')
      return
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
    const timeout = setTimeout(() => {
      window.addEventListener('click', handleMouseClick)
    }, 500)

    return () => {
      window.removeEventListener('click', handleMouseClick)
      clearTimeout(timeout)
    }
  }, [props.stagedPoint])

  return <></>
}
