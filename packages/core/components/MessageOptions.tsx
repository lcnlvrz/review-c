import { useReview } from '../providers/ReviewProvider'
import { getContentShadowDomRef } from '../utils/get-content-shadow-dom-ref'
import { Edit2, MoreHorizontal, Trash } from 'lucide-react'
import { Button, Popover, PopoverContent, PopoverTrigger, cn } from 'ui'

export const MessageOptions = (props: {
  onDelete: () => void
  onEdit: () => void
  className?: string
}) => {
  const ctx = useReview()

  const portal = getContentShadowDomRef(ctx.PORTAL_SHADOW_ID)

  return (
    <div className={cn('absolute top-0 right-0', props.className)}>
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
          <ul className="flex flex-col">
            <li
              onClick={props.onEdit}
              className="rounded-lg flex flex-row items-center hover:bg-gray-100 transition-all p-2 cursor-pointer space-x-2 text-xs"
            >
              <Edit2 className="w-3 h-3" />
              <p>Edit</p>
            </li>
            <li
              onClick={props.onDelete}
              className="rounded-lg flex flex-row items-center hover:bg-gray-100 transition-all p-2 cursor-pointer space-x-2 text-xs"
            >
              <Trash className="w-3 h-3 text-red-500 " />
              <p>Delete</p>
            </li>
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  )
}
