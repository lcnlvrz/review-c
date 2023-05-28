import { useReview } from '../providers/ReviewProvider'
import { getContentShadowDomRef } from '../utils/get-content-shadow-dom-ref'
import { composeUserName, type MessagePopulated } from 'common'
import dayjs from 'dayjs'
import { Smartphone, Monitor } from 'lucide-react'
import React from 'react'
import { cn, ImageGallery } from 'ui'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'ui'

export const MessageContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'border-gray-400 w-[30rem] border shadow-lg rounded-2xl flex flex-col bg-white [&>*:not([role="divider"])]:p-4 z-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

export const MessageContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    message: Omit<MessagePopulated, 'id'>
    className?: string
    focus?: boolean
    renderTooltip?: React.ReactNode
    isMobile?: boolean
  }
>(({ className, focus, renderTooltip, isMobile, children, ...props }, ref) => {
  const ctx = useReview()

  const dateDisplay = (
    <p className="text-xs text-gray-400">
      {dayjs(props.message.createdAt).fromNow()}
    </p>
  )

  return (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-5', className)}
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
        {isMobile ? (
          <Smartphone className="w-4 h-4" />
        ) : (
          <Monitor className="w-4 h-4" />
        )}
        {focus ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>{dateDisplay}</TooltipTrigger>
              <TooltipContent asChild>{renderTooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          dateDisplay
        )}
      </div>
      <p className="text-sm break-all !py-0 m-0">{props.message.content}</p>

      {props.message.files.length > 0 && (
        <ImageGallery
          portalRef={getContentShadowDomRef(ctx.PORTAL_SHADOW_ID)}
          images={props.message.files}
        />
      )}

      {children}
    </div>
  )
})
