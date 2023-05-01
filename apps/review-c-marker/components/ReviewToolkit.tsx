import { Cursor } from './Cursor'
import { Points } from './Points'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './Tooltip'
import { Portal } from '@radix-ui/react-tooltip'
import { Inbox, MessageCircle } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDisclosure } from '~hooks/useDisclosure'
import { cn } from '~lib/utils'

export const ReviewToolkit = () => {
  const ref = useRef<HTMLDivElement>()

  const isCursorFocused = useDisclosure()
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

  const iterateOverSelectableElements = useCallback(
    (pointerEvents: 'auto' | 'none') => {
      ;(['a', 'iframe'] as const).forEach((tagname) => {
        window.document.querySelectorAll(tagname).forEach((ele) => {
          ele.style.pointerEvents = pointerEvents
        })
      })
    },
    []
  )

  const onToggleComment = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation()
      const [html] = window.document.getElementsByTagName('html')

      if (isCursorFocused.isOpen) {
        isCursorFocused.onClose()
        html.style.cursor = 'auto'
        html.style.userSelect = 'auto'
        iterateOverSelectableElements('auto')
      }

      if (!isCursorFocused.isOpen) {
        isCursorFocused.onOpen()

        html.style.cursor = 'none'
        html.style.userSelect = 'none'
        iterateOverSelectableElements('none')
      }
    },
    [isCursorFocused.isOpen]
  )

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <Points isCursorFocused={isCursorFocused.isOpen} />
      {isCursorFocused.isOpen && <Cursor x={cursor.x} y={cursor.y} />}

      <div ref={ref} className="fixed bottom-0 p-3 right-[50%] left-[50%]">
        <div className="flex items-center justify-center">
          <div className="bg-gray-800 rounded-full h-[4rem] p-3 flex flex-row justify-between space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={onToggleComment}
                    className={cn(
                      'hover:bg-gray-600 rounded-full transition-all',
                      {
                        'bg-gray-600': isCursorFocused.isOpen,
                      }
                    )}
                  >
                    <MessageCircle className="text-white w-[30px] p-1" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="rounded-full bg-white border-gray-300">
                  <p>Agregar comentario</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
