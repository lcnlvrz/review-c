import { Cursor } from './Cursor'
import { Points } from './Points'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './Tooltip'
import { WaitForQuery } from './WaitForQuery'
import { MessageCircle } from 'lucide-react'
import { useRef } from 'react'
import { useReviewDetail } from '~hooks/useReviewDetail'
import { cn } from '~lib/utils'
import { useReview } from '~providers/ReviewProvider'

export const ReviewToolkit = () => {
  const ref = useRef<HTMLDivElement>()
  const ctx = useReview()

  const query = useReviewDetail()

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <WaitForQuery query={query}>
        {({ data }) => <Points threads={data?.threads} />}
      </WaitForQuery>
      {ctx.cursorFocused && <Cursor />}
      <div
        ref={ref}
        className="fixed w-[10rem] bottom-0 p-3 right-[50%] left-[50%]"
      >
        <div className="flex items-center justify-start w-full">
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
    </div>
  )
}
