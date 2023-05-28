import { useReview } from '../providers/ReviewProvider'
import { getContentShadowDomRef } from '../utils/get-content-shadow-dom-ref'
import { Edit2, MoreHorizontal, Trash } from 'lucide-react'
import React from 'react'
import { Button, Popover, PopoverContent, PopoverTrigger, cn } from 'ui'

export const MessageEdit = (props: { onEdit: () => void }) => {
  return (
    <li
      onClick={props.onEdit}
      className="rounded-lg flex flex-row items-center hover:bg-gray-100 transition-all p-2 cursor-pointer space-x-2 text-xs"
    >
      <Edit2 className="w-3 h-3" />
      <p>Edit</p>
    </li>
  )
}

export const MessageDelete = (props: { onDelete: () => void }) => {
  return (
    <li
      onClick={props.onDelete}
      className="rounded-lg flex flex-row items-center hover:bg-gray-100 transition-all p-2 cursor-pointer space-x-2 text-xs"
    >
      <Trash className="w-3 h-3 text-red-500 " />
      <p>Delete</p>
    </li>
  )
}

export const MessageOptionsList = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<'ul'>
>(({ className, ...props }, ref) => {
  return <ul ref={ref} className={cn('flex flex-col', className)} {...props} />
})

export const MessageOptionsContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('absolute top-0 right-0', className)}
      {...props}
    />
  )
})

export const MessageOptions = (props: {
  onDelete: () => void
  onEdit: () => void
  className?: string
}) => {
  const ctx = useReview()

  const portal = getContentShadowDomRef(ctx.PORTAL_SHADOW_ID)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          className="outline-0 border-none hover:bg-gray-100 rounded-lg"
          variant="ghost"
        >
          <MoreHorizontal />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-white border-none rounded-lg p-2 w-40"
        container={portal}
      >
        <MessageOptionsList>
          <MessageEdit onEdit={props.onEdit} />
          <MessageDelete onDelete={props.onDelete} />
        </MessageOptionsList>
      </PopoverContent>
    </Popover>
  )
}
