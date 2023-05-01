import { Cursor } from './Cursor'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './Tooltip'
import cursor from 'data-base64:~assets/icon.png'
import { Inbox, MessageCircle } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDisclosure } from '~hooks/useDisclosure'
import { cn } from '~lib/utils'

export const ReviewToolkit = () => {
  const ref = useRef<HTMLDivElement>()

  const isCursorFocused = useDisclosure()

  const onClickAnchor = useCallback(() => {
    return false
  }, [])

  const onToggleComment = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation()
      const [html] = window.document.getElementsByTagName('html')

      if (isCursorFocused.isOpen) {
        isCursorFocused.onClose()
        html.style.cursor = 'auto'
        html.style.userSelect = 'auto'
        window.document.querySelectorAll('a').forEach((htmlEle) => {
          htmlEle.style.pointerEvents = 'auto'
        })
      }

      if (!isCursorFocused.isOpen) {
        isCursorFocused.onOpen()

        html.style.cursor = 'none'
        html.style.userSelect = 'none'
        window.document.querySelectorAll('a').forEach((htmlEle) => {
          htmlEle.style.pointerEvents = 'none'
        })
      }
    },
    [isCursorFocused.isOpen]
  )

  return (
    <div>
      {isCursorFocused.isOpen && <Cursor />}

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
