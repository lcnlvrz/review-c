import { ConfirmDeleteThread } from './ConfirmDeleteThread'
import { InspectElements } from './InspectElements'
import { MessageContainer, MessageContent } from './Message'
import { MessageInput } from './MessageInput'
import { MessageOptions } from './MessageOptions'
import { Button } from './button/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import type { Point } from 'database'
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  MoreVertical,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  ScrollArea,
  Separator,
} from 'ui'
import type {
  AddMessageToThreadInput,
  MessagePopulated,
} from '~../../packages/common'
import { useAPI } from '~hooks/useAPI'
import { useDisclosure } from '~hooks/useDisclosure'
import { buildReviewDetailQueryKey } from '~hooks/useReviewDetail'
import { useScreenshot } from '~hooks/useScreenshot'
import { discriminateMessages } from '~lib/discriminate-messages'
import { getContentShadowDomRef } from '~lib/get-content-shadow-dom-ref'
import { useReview } from '~providers/ReviewProvider'
import { messageSchema, type MessageSchema } from '~schemas/message.schema'
import { type PointSchema } from '~schemas/point.schema'

interface MessageFormProps {
  onSubmit: (data: AddMessageToThreadInput, onDone: () => void) => void
  defaultValues?: Partial<MessagePopulated>
  threadId: number
  point: Omit<Point, 'id' | 'createdById'> & {
    left: number
    top: number
  }
}

const AddMessageToThread = (props: Omit<MessageFormProps, 'onSubmit'>) => {
  const reviewAPI = useAPI('review')

  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const ctx = useReview()

  const onAddMessageToThread = useCallback(
    (data: AddMessageToThreadInput, done: () => void) => {
      setIsLoading(true)

      reviewAPI
        .addMessageToThread(
          ctx.reviewSession.workspace.id,
          ctx.reviewSession.review.id,
          props.threadId,
          data
        )
        .then(() => {
          queryClient.invalidateQueries([
            buildReviewDetailQueryKey(ctx.reviewSession.review.id),
          ])

          done()
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [ctx.reviewSession]
  )

  return <MessageForm onSubmit={onAddMessageToThread} {...props} />
}

const MessageForm = (props: MessageFormProps) => {
  const screenshotsCtrl = useScreenshot(
    (props.defaultValues?.files || []).map((file) => {
      return {
        isLoading: false,
        name: file.originalFilename,
        progress: 0,
        src: file.src,
        token: file.token,
      }
    })
  )

  const formCtrl = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: props.defaultValues?.content || '',
    },
  })

  const inspectElementsCtrl = useDisclosure()

  return (
    <MessageInput
      height="h-20"
      screenshotsCtrl={screenshotsCtrl}
      point={props.point}
      formCtrl={formCtrl}
      inspectElementsCtrl={inspectElementsCtrl}
      onSubmit={(data) => {
        props.onSubmit(
          {
            message: data.message,
            files: screenshotsCtrl.screenshots.map(
              (screenshot) => screenshot.token
            ),
          },
          () => {
            formCtrl.reset()
            screenshotsCtrl.clearScreenshots()
          }
        )
      }}
    />
  )
}

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

const Reply = (props: {
  point: MessageFormProps['point']
  message: MessagePopulated
  onDelete: () => void
  onUpdate: MessageFormProps['onSubmit']
  threadId: number
}) => {
  const editCtrl = useDisclosure()

  const ctx = useReview()

  return (
    <div className="relative">
      {!editCtrl.isOpen && <MessageContent message={props.message} />}

      <MessageOptions onDelete={props.onDelete} onEdit={editCtrl.toggle} />
      {ctx.auth.id === props.message.sentById && editCtrl.isOpen && (
        <MessageForm
          onSubmit={(data, done) =>
            props.onUpdate(data, () => {
              done()
              editCtrl.toggle()
            })
          }
          point={props.point}
          threadId={props.threadId}
          defaultValues={props.message}
        />
      )}
    </div>
  )
}

export const Thread = (props: {
  startedById: number
  threadId: number
  messages: MessagePopulated[]
  point: Omit<Point, 'id' | 'createdById'> & {
    left: number
    top: number
  }
}) => {
  const ctx = useReview()

  const [isLoading, setIsLoading] = useState(false)

  const screenshotsCtrl = useScreenshot()

  const deleteThreadCtrl = useDisclosure()

  const editCtrl = useDisclosure()

  const reviewAPI = useAPI('review')

  const queryClient = useQueryClient()

  const inspectElementsCtrl = useDisclosure()

  const bottomMessageList = useRef<HTMLDivElement>(null)

  console.log('editCtrl', editCtrl)

  const onUpdateMessage = useCallback(
    (messageId: number, data: AddMessageToThreadInput, onDone: () => void) => {
      reviewAPI
        .updateMessage(
          ctx.reviewSession.workspace.id,
          ctx.reviewSession.review.id,
          props.threadId,
          messageId,
          data
        )
        .then((res) => {
          queryClient.invalidateQueries([
            buildReviewDetailQueryKey(ctx.reviewSession.review.id),
          ])

          editCtrl.onClose()
          onDone()
        })
    },
    [props.threadId]
  )

  const deleteMessage = useCallback(
    (messageId: number) => {
      reviewAPI
        .deleteMessageFromThread(
          ctx.reviewSession.workspace.id,
          ctx.reviewSession.review.id,
          props.threadId,
          messageId
        )
        .then((res) => {
          queryClient.invalidateQueries([
            buildReviewDetailQueryKey(ctx.reviewSession.review.id),
          ])
        })
    },
    [props.threadId]
  )

  const { starterMessage, subsequentMessages } = discriminateMessages(
    props.messages
  )

  useEffect(() => {
    if (bottomMessageList.current) {
      bottomMessageList.current.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [props.messages.length])

  return (
    <>
      {ctx.mustShowAbsoluteElements && (
        <MessageContainer>
          <div className="relative">
            {editCtrl.isOpen ? (
              <MessageForm
                onSubmit={(data, onDone) =>
                  onUpdateMessage(starterMessage.id, data, onDone)
                }
                defaultValues={starterMessage}
                threadId={props.threadId}
                point={props.point}
              />
            ) : (
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
            )}

            {ctx.auth.id === props.startedById && (
              <>
                <ConfirmDeleteThread
                  threadId={props.threadId}
                  onClose={deleteThreadCtrl.onClose}
                  ctrl={deleteThreadCtrl}
                />
                <MessageOptions
                  onEdit={editCtrl.toggle}
                  onDelete={deleteThreadCtrl.toggle}
                />
              </>
            )}
          </div>

          <div className="!py-0 flex flex-row items-center space-x-1 text-gray-500">
            <MessageCircle className="h-5 w-5" />
            <p>{subsequentMessages.length} replies</p>
          </div>
          <Separator className="mt-4 bg-gray-100" />
          {subsequentMessages.length > 0 && (
            <ScrollArea className="max-h-60">
              <div className="flex flex-col space-y-8">
                {subsequentMessages.map((message, index) => (
                  <Reply
                    key={index}
                    message={message}
                    onDelete={() => deleteMessage(message.id)}
                    onUpdate={(data, onDone) =>
                      onUpdateMessage(message.id, data, onDone)
                    }
                    point={props.point}
                    threadId={props.threadId}
                  />
                ))}
                <div ref={bottomMessageList} />
              </div>
            </ScrollArea>
          )}

          <AddMessageToThread point={props.point} threadId={props.threadId} />
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
