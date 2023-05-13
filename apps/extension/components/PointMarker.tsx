import { MarkerAvatar } from './MarkerAvatar'
import type { Point, User } from '.prisma/client'
import { composeUserName, type MessagePopulated } from 'common'
import type { Message } from 'common'
import dayjs from 'dayjs'
import { MessageCircle, Monitor, Smartphone } from 'lucide-react'
import React, { type HTMLProps } from 'react'
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
import { getContentShadowDomRef } from '~lib/get-content-shadow-dom-ref'
import { cn } from '~lib/utils'

interface CommonPointProps<TVisible extends boolean = true>
  extends Omit<Point, 'id' | 'createdById'> {
  createdAt: Date
  createdBy: User
  visible: TVisible
  xPath: string
  xPercentage: number
  yPercentage: number
  message: Omit<MessagePopulated, 'id'>
}

const MessageDisplay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    message: Omit<MessagePopulated, 'id'>
    className?: string
    focus?: boolean
    renderTooltip?: React.FC<any>
    isMobile?: boolean
  }
>(({ className, focus, renderTooltip, isMobile, ...props }, ref) => {
  const dateDisplay = (
    <p className="text-sm text-gray-400">
      {dayjs(props.message.createdAt).fromNow()}
    </p>
  )

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-4 bg-white p-4 rounded-3xl w-96',
        className
      )}
      {...props}
    >
      <div className="flex flex-row space-x-2 items-center">
        <Avatar size="sm" className="border border-gray-200">
          <AvatarImage src={props.message.sentBy.avatar} alt="@shadcn" />
          <AvatarFallback>
            {composeUserName(props.message.sentBy)}
          </AvatarFallback>
        </Avatar>
        <p className="font-bold">{composeUserName(props.message.sentBy)}</p>
        {isMobile ? <Smartphone /> : <Monitor />}
        {focus ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>{dateDisplay}</TooltipTrigger>
              <TooltipContent
                className="rounded-lg border border-gray-200 p-4"
                asChild
              >
                {renderTooltip({})}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          dateDisplay
        )}
      </div>
      <p className="text-sm break-all">{props.message.content}</p>
    </div>
  )
})

export type MarkerPoint =
  | (CommonPointProps & {
      top: number
      left: number
    })
  | CommonPointProps<false>

export const PointMarker = (props: {
  point: Extract<MarkerPoint, { visible: true }>
  message?: Omit<MessagePopulated, 'id'>
  isStagedPoint?: boolean
}) => {
  const popover = useDisclosure()
  const tooltip = useDisclosure()

  return (
    <div>
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

      {!props.isStagedPoint && (
        <>
          <TooltipProvider>
            <Tooltip
              onOpenChange={tooltip.setIsOpen}
              open={popover.isOpen ? false : tooltip.isOpen}
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
                className="bg border-gray-200 rounded-2xl w-96 p-4"
                asChild
              >
                <MessageDisplay
                  onClick={() => {
                    popover.onOpen()
                    tooltip.onClose()
                  }}
                  className="cursor-pointer"
                  message={props.message}
                />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Popover
            open={popover.isOpen}
            onOpenChange={(open) => {
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
              className="bg-white border border-gray-200 rounded-2xl w-96 p-4"
              asChild
              container={getContentShadowDomRef()}
            >
              <MessageDisplay
                renderTooltip={() => (
                  <div className="flex flex-col space-y-4 rounded-2xl border border-gray-200 w-96">
                    <table>
                      <tbody>
                        <tr>
                          <th align="left" className="font-bold capitalize">
                            browser
                          </th>
                          <td>{props.point.browser}</td>
                        </tr>
                        <tr>
                          <th align="left" className="font-bold uppercase">
                            os
                          </th>
                          <td>{props.point.os}</td>
                        </tr>
                        <tr>
                          <th align="left" className="font-bold capitalize">
                            window size
                          </th>
                          <td>
                            {props.point.windowWidth}x{props.point.windowHeight}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
                focus
                message={props.message}
              />
            </PopoverContent>
          </Popover>
        </>
      )}
    </div>
  )
}
