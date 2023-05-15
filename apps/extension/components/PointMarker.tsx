import { MarkerAvatar } from './MarkerAvatar'
import { MessageContent } from './Message'
import { Thread } from './Thread'
import { composeUserName, type MessagePopulated } from 'common'
import type { Message } from 'common'
import type { Point, User } from 'database'
import dayjs from 'dayjs'
import { MessageCircle, Monitor, Smartphone } from 'lucide-react'
import React, { useState, type HTMLProps } from 'react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'ui'
import { useDisclosure } from '~hooks/useDisclosure'
import { discriminateMessages } from '~lib/discriminate-messages'
import { getContentShadowDomRef } from '~lib/get-content-shadow-dom-ref'
import { cn } from '~lib/utils'
import { useReview } from '~providers/ReviewProvider'

interface CommonPointProps<TVisible extends boolean = true>
  extends Omit<Point, 'id' | 'createdById'> {
  createdAt: Date
  createdBy: User
  startedById?: number
  threadId?: number
  visible: TVisible
  xPath: string
  xPercentage: number
  yPercentage: number
  messages: Omit<MessagePopulated, 'id'>[]
}

export type MarkerPoint =
  | (CommonPointProps & {
      top: number
      left: number
    })
  | CommonPointProps<false>

export const PointMarker = (props: {
  point: Extract<MarkerPoint, { visible: true }>
  messages: Omit<MessagePopulated, 'id'>[]
  isStagedPoint?: boolean
}) => {
  const popover = useDisclosure()
  const tooltip = useDisclosure()

  const ctx = useReview()

  const { starterMessage } = discriminateMessages(props.messages)

  return (
    <div>
      {ctx.mustShowAbsoluteElements && (
        <div>
          <div
            className={cn(`absolute z-1`)}
            style={{
              transform: `translate(${props.point.left}px, ${props.point.top}px)`,
            }}
          >
            <div className="bg-white p-2 rounded-full shadow-lg border-gray-400 border">
              <MessageCircle className="-scale-x-1 text-primary" />
            </div>
          </div>
          <div
            className={cn(`absolute z-1`)}
            style={{
              transform: `translate(${props.point.left + 25}px, ${
                props.point.top
              }px)`,
            }}
          >
            <MarkerAvatar
              src={props.point.createdBy.avatar}
              name={composeUserName(props.point.createdBy)}
            />
          </div>
        </div>
      )}

      {!props.isStagedPoint && (
        <>
          <TooltipProvider>
            <Tooltip
              onOpenChange={tooltip.setIsOpen}
              open={
                popover.isOpen || !ctx.mustShowAbsoluteElements
                  ? false
                  : tooltip.isOpen
              }
              delayDuration={0}
            >
              <TooltipTrigger asChild>
                <div
                  className={cn(`absolute z-10 h-10 w-20`)}
                  style={{
                    transform: `translate(${props.point.left}px, ${props.point.top}px)`,
                  }}
                />
              </TooltipTrigger>
              <TooltipContent
                className={'border border-gray-200 rounded-2xl w-96 p-4'}
                asChild
              >
                <MessageContent
                  onClick={() => {
                    popover.onOpen()
                    tooltip.onClose()
                  }}
                  className="cursor-pointer"
                  message={starterMessage}
                />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Popover
            open={popover.isOpen}
            onOpenChange={(open) => {
              if (!ctx.mustShowAbsoluteElements) return

              popover.setIsOpen(open)
              tooltip.onClose()
            }}
          >
            <PopoverTrigger asChild>
              <div
                className={cn(`absolute z-1 h-10 w-20`)}
                style={{
                  transform: `translate(${props.point.left}px, ${props.point.top}px)`,
                }}
              />
            </PopoverTrigger>
            <PopoverContent
              className="border-none outline-none p-0"
              container={getContentShadowDomRef()}
            >
              <Thread
                startedById={props.point.startedById}
                threadId={props.point.threadId}
                messages={props.messages}
                point={props.point}
              />
            </PopoverContent>
          </Popover>
        </>
      )}
    </div>
  )
}
