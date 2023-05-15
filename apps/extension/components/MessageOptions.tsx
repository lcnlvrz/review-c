import { Button } from './button/button'
import { Edit2, MoreHorizontal, Trash } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from 'ui'
import { getContentShadowDomRef } from '~lib/get-content-shadow-dom-ref'

export const MessageOptions = (props: {
  onDelete: () => void
  onEdit: () => void
}) => {
  const portal = getContentShadowDomRef()

  return (
    <div className="absolute top-0 right-0 p-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="xs"
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
