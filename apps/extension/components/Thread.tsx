import { InspectElements } from './InspectElements'
import { MessageContainer, MessageContent } from './Message'
import { MessageInput } from './MessageInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import type { Point } from 'database'
import { MessageCircle } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Separator } from 'ui'
import type { MessagePopulated } from '~../../packages/common'
import { useAPI } from '~hooks/useAPI'
import { useDisclosure } from '~hooks/useDisclosure'
import { buildReviewDetailQueryKey } from '~hooks/useReviewDetail'
import { useScreenshot } from '~hooks/useScreenshot'
import { discriminateMessages } from '~lib/discriminate-messages'
import { isExtensionDOM } from '~lib/is-extension-dom'
import { useReview } from '~providers/ReviewProvider'
import { messageSchema, type MessageSchema } from '~schemas/message.schema'
import { type PointSchema } from '~schemas/point.schema'

const MessageContext = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement> & {
    browser: string
    os: string
    windowWidth: number
    windowHeight: number
  }
>((props, ref) => {
  return (
    <div
      ref={ref}
      className="flex bg-white p-4 flex-col space-y-4 rounded-2xl border border-gray-200 w-96 text-sm"
    >
      <table>
        <tbody>
          <tr>
            <th align="left" className="font-bold capitalize">
              browser
            </th>
            <td>{props.browser}</td>
          </tr>
          <tr>
            <th align="left" className="font-bold uppercase">
              os
            </th>
            <td>{props.os}</td>
          </tr>
          <tr>
            <th align="left" className="font-bold capitalize">
              window size
            </th>
            <td>
              {props.windowWidth}x{props.windowHeight}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
})

export const Thread = (props: {
  threadId: number
  messages: Omit<MessagePopulated, 'id'>[]
  point: Omit<Point, 'id' | 'createdById'> & {
    left: number
    top: number
  }
}) => {
  const ctx = useReview()

  const [isLoading, setIsLoading] = useState(false)

  const screenshotsCtrl = useScreenshot()

  const formCtrl = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: '',
    },
  })

  const reviewAPI = useAPI('review')

  const queryClient = useQueryClient()

  const inspectElementsCtrl = useDisclosure()

  const onAddMessageToThread = useCallback(
    (data: PointSchema) => {
      setIsLoading(true)

      reviewAPI
        .addMessageToThread(
          ctx.reviewSession.workspace.id,
          ctx.reviewSession.review.id,
          props.threadId,
          {
            message: data.message,
            files: screenshotsCtrl.screenshots.map(
              (screenshot) => screenshot.token
            ),
          }
        )
        .then(() => {
          queryClient.invalidateQueries([
            buildReviewDetailQueryKey(ctx.reviewSession.review.id),
          ])

          screenshotsCtrl.clearScreenshots()
          formCtrl.reset()
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [ctx.reviewSession, screenshotsCtrl.screenshots.length]
  )

  const { starterMessage, subsequentMessages } = discriminateMessages(
    props.messages
  )

  return (
    <>
      {ctx.mustShowAbsoluteElements && (
        <MessageContainer>
          <MessageContent
            className="!m-0"
            renderTooltip={
              <MessageContext
                browser={props.point.browser}
                os={props.point.os}
                windowHeight={props.point.windowHeight}
                windowWidth={props.point.windowWidth}
              />
            }
            focus
            message={starterMessage}
          />
          <div className="!py-0 flex flex-row items-center space-x-1 text-gray-500">
            <MessageCircle className="h-5 w-5" />
            <p>{subsequentMessages.length} replies</p>
          </div>
          <Separator className="mt-4 bg-gray-100" />
          {subsequentMessages.map((message) => (
            <MessageContent message={message} />
          ))}
          <MessageInput
            height="h-20"
            screenshotsCtrl={screenshotsCtrl}
            point={props.point}
            formCtrl={formCtrl}
            inspectElementsCtrl={inspectElementsCtrl}
            onSubmit={onAddMessageToThread}
          />
        </MessageContainer>
      )}

      {inspectElementsCtrl.isOpen && (
        <InspectElements
          onClose={inspectElementsCtrl.onClose}
          onSelectElement={screenshotsCtrl.takeScreenshot}
        />
      )}
    </>
  )
}
