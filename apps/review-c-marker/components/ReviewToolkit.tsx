import { Cursor } from './Cursor'
import { Points } from './Points'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './Tooltip'
import { MessageCircle } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '~lib/utils'
import { useReview } from '~providers/ReviewProvider'

export const ReviewToolkit = () => {
  const ref = useRef<HTMLDivElement>()

  const ctx = useReview()

  const [cursor, setCursor] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

  const handleMouseMove = useCallback((event: MouseEvent) => {
    setCursor({
      x: event.clientX,
      y: event.clientY,
    })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <Points />
      {ctx.cursorFocused && <Cursor x={cursor.x} y={cursor.y} />}
      <div
        ref={ref}
        className="fixed w-[10rem] h-[5rem] bottom-0 p-3 right-[50%] left-[50%]"
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
