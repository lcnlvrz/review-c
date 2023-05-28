import { useAPI } from '../hooks/useAPI'
import { useFloatingMarker } from '../hooks/useFloatingMarker'
import { useScreenshot } from '../hooks/useScreenshot'
import { useReview } from '../providers/ReviewProvider'
import { messageSchema, MessageSchema } from '../schemas/message.schema'
import { PointSchema } from '../schemas/point.schema'
import { getContentShadowDomRef } from '../utils/get-content-shadow-dom-ref'
import { getXPath } from '../utils/get-xpath'
import { buildReviewDetailQueryKey } from '../utils/query-key-builders'
import { CURSOR_ID } from './Cursor'
import { StagedMarkerEle, TEXT_NODE_TYPE } from './GridMarkers'
import { MarkerElement } from './MarkerElement'
import { MessageContainer } from './Message'
import { MessageInput } from './MessageInput'
import { TOOLKIT_CONTAINER_ID } from './Toolkit'
import { autoPlacement, shift, useFloating } from '@floating-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { getUserAgentSpecs, UserAgentSpecs } from 'common'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { cn } from 'ui'

const MESSAGE_INPUT_CONTAINER = 'review-c-message-input-container'

dayjs.extend(relativeTime)

export const StagedMarker = (props: {
  stagedMarker: StagedMarkerEle
  clearStagedPoint: () => void
}) => {
  const ctx = useReview()

  const [isLoading, setIsLoading] = useState(false)

  const screenshotsCtrl = useScreenshot()

  const point = props.stagedMarker[props.stagedMarker.type]

  const methods = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: '',
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
            type: props.stagedMarker.type,
            files: screenshotsCtrl.screenshots.map(
              (screenshot) => screenshot.token
            ),
            message: data.message,
            pathname: window.location.pathname,
            point: props.stagedMarker.point,
            selection: props.stagedMarker.selection,
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
    [ctx.reviewSession, screenshotsCtrl.screenshots.length, props.stagedMarker]
  )

  const { floating } = useFloatingMarker(point)

  if (!point.visible) return

  return (
    <div
      className={cn({
        hidden: !ctx.mustShowAbsoluteElements,
      })}
    >
      <MarkerElement
        ref={floating.refs.setReference}
        messages={[]}
        marker={props.stagedMarker}
      />
      <MessageContainer
        id={MESSAGE_INPUT_CONTAINER}
        style={floating.floatingStyles}
        ref={floating.refs.setFloating}
      >
        <MessageInput
          className="rounded-t-2xl !p-3"
          onSubmit={onStartThread}
          formCtrl={methods}
          point={point}
          screenshotsCtrl={screenshotsCtrl}
        />
      </MessageContainer>
    </div>
  )
}

function assertSpecsClientSide(
  specs: UserAgentSpecs
): asserts specs is Required<UserAgentSpecs> {
  if (
    typeof specs.windowHeight !== 'number' ||
    typeof specs.windowWidth !== 'number'
  ) {
    throw new Error('Specs are not client side')
  }
}

export const StagedMarkerListener = (props: {
  stagedMarker?: StagedMarkerEle
  setStagedMarker: (point: StagedMarkerEle) => void
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

  const buildStagedMaker = useCallback(() => {
    const specs = getUserAgentSpecs(navigator.userAgent)

    assertSpecsClientSide(specs)

    return {
      ...specs,
      createdBy: ctx.auth,
      messages: [],
      createdAt: new Date(),
    }
  }, [])

  const injectRootStyles = useCallback(() => {
    const baseStyle = window.document.getElementsByTagName('style').item(0)

    const extendedStyles = `
    ::selection {
      color: white;
      background: black;
    }
    `

    if (baseStyle) {
      baseStyle.textContent = `
    ${baseStyle.textContent}

    ${extendedStyles}
    `
    }

    if (!baseStyle) {
      const style = window.document.createElement('style')
      style.textContent = extendedStyles

      window.document.appendChild(style)
    }
  }, [])

  const onSelection = useCallback((event: MouseEvent) => {
    const selection = window.document.getSelection()

    const stagedInputContainer = ctx.PORTAL_SHADOW_ID
      ? getContentShadowDomRef(MESSAGE_INPUT_CONTAINER)
      : window.document.getElementById(MESSAGE_INPUT_CONTAINER)

    const clickedInsideMessageInput = stagedInputContainer?.contains(
      event.target as HTMLElement
    )

    if (!selection.toString()) {
      if (!clickedInsideMessageInput) {
        props.setStagedMarker(undefined)
      }

      return
    }

    const range = selection.getRangeAt(0)

    let startChildrenNodeIndex: number = 0
    let endChildrenNodeIndex: number = 0

    range.startContainer.parentElement.childNodes.forEach((node, index) => {
      if (node.isEqualNode(range.startContainer)) {
        startChildrenNodeIndex = index
      }
    })

    range.endContainer.parentElement.childNodes.forEach((node, index) => {
      if (node.isEqualNode(range.endContainer)) {
        endChildrenNodeIndex = index
      }
    })

    const marker: StagedMarkerEle = {
      ...buildStagedMaker(),
      type: 'selection',
      selection: {
        endChildrenNodeIndex,
        startChildrenNodeIndex,
        top: event.pageY,
        left: event.pageX,
        visible: true,
        startContainerXPath: getXPath(range.startContainer.parentElement),
        endContainerXPath: getXPath(range.endContainer.parentElement),
        startOffset: range.startOffset,
        endOffset: range.endOffset,
      },
    }

    console.log('marker', marker)

    props.setStagedMarker(marker)
  }, [])

  const onClick = useCallback((event: MouseEvent) => {
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

    console.log('clicked')

    const target = event.target as HTMLElement

    const xPath = getXPath(target)

    const rect = target.getBoundingClientRect()

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const point: StagedMarkerEle = {
      ...buildStagedMaker(),
      type: 'point',
      point: {
        top: event.pageY,
        left: event.pageX,
        visible: true,
        yPercentage: (y / rect.height) * 100,
        xPercentage: (x / rect.width) * 100,
        xPath,
      },
    }

    props.setStagedMarker(point)
    ctx.blurCursor()
  }, [])

  useEffect(() => {
    injectRootStyles()

    window.document.addEventListener('mouseup', onSelection)

    return () => {
      window.document.removeEventListener('mouseup', onSelection)
    }
  }, [])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (ctx.cursorFocused) {
      timeout = setTimeout(() => {
        window.addEventListener('click', onClick)
      }, 500)
    }

    return () => {
      window.removeEventListener('click', onClick)
      clearTimeout(timeout)
    }
  }, [props.stagedMarker, ctx.cursorFocused])

  return <></>
}
