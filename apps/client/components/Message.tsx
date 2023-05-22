import { cn } from '@/utils/cn'
import { composeUserName } from 'common'
import type { User } from 'database'
import dayjs from 'dayjs'
import timeAgo from 'dayjs/plugin/relativeTime'
import React from 'react'
import { Avatar, AvatarImage, ImageGallery } from 'ui'

dayjs.extend(timeAgo)

export const Message = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => {
  return (
    <li
      className={cn(
        'flex flex-row space-x-2 items-start rounded-lg transition-all p-3 w-full',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

export const MessageText = React.forwardRef<
  HTMLParagraphElement,
  React.HtmlHTMLAttributes<typeof HTMLParagraphElement> & { message: string }
>(({ message, ...props }, ref) => {
  return (
    <p className="break-all !m-0" {...props} ref={ref}>
      {message}
    </p>
  )
})

export const MessageContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div
      ref={ref}
      className="flex flex-col space-y-2 w-full items-start"
      {...props}
    />
  )
})

export const MessageAuthor = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    createdAt: Date
    sentBy: User
  }
>(({ sentBy, createdAt, ...props }, ref) => {
  return (
    <div ref={ref} className="flex flex-row items-center  space-x-5" {...props}>
      <h4 className="font-bold text-lg">{composeUserName(sentBy)}</h4>
      <span className="text-gray-500 text-xs">
        {dayjs(createdAt).fromNow()}
      </span>
    </div>
  )
})

export const MessageFiles = React.forwardRef<
  React.ElementRef<typeof ImageGallery>,
  React.ComponentPropsWithoutRef<typeof ImageGallery>
>((props, ref) => {
  return (
    <div className="w-full">
      <ImageGallery ref={ref} {...props} />
    </div>
  )
})

export const MessageAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  React.ComponentPropsWithoutRef<typeof Avatar> & { avatar: string }
>(({ avatar, ...props }, ref) => {
  return (
    <Avatar className="mt-1" {...props}>
      <AvatarImage src={avatar} />
    </Avatar>
  )
})
