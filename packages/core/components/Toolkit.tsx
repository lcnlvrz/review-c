import { useReview } from '../providers/ReviewProvider'
import { Cursor } from './Cursor'
import { MessageCircle } from 'lucide-react'
import { useRef } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
} from 'ui'

export const TOOLKIT_CONTAINER_ID = 'toolkit-container'

export const Toolkit = () => {
  const ref = useRef<HTMLDivElement>()
  const ctx = useReview()

  return (
    <>
      <Cursor focus={ctx.cursorFocused} />
      <div
        id={TOOLKIT_CONTAINER_ID}
        ref={ref}
        className={cn(
          'fixed bottom-0 p-3 left-[50%] -translate-x-[50%] z-[50]',
          {
            hidden: !ctx.mustShowAbsoluteElements,
          }
        )}
      >
        <div className="flex items-center justify-start">
          <div className="bg-primary flex items-center border-[1px] border-gray-400 w-full p-2 h-[3rem] rounded-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  onClick={ctx.toggleCursor}
                  className={cn(
                    'hover:bg-gray-300 rounded-full transition-all p-2'
                  )}
                >
                  <MessageCircle className="text-white w-[20px] h-[20px]" />
                </TooltipTrigger>
                <TooltipContent className="rounded-full bg-white border-gray-300">
                  <p className="text-black">Comment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </>
  )
}
