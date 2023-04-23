import { Inbox, MessageCircle } from "lucide-react"

import { cn } from "~lib/utils"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./Tooltip"

export const ReviewToolkit = () => {
  return (
    <div className="fixed bottom-0 p-3 w-full">
      <div className="w-full flex items-center justify-center">
        <div className="bg-gray-800 rounded-full h-[3rem] p-3 flex flex-row justify-between space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <button className="hover:bg-gray-600 rounded-full transition-all">
                  <MessageCircle className="text-white w-[30px] p-1" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="rounded-full bg-white border-gray-300">
                <p>Agregar comentario</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <button className="hover:bg-gray-600 rounded-full transition-all">
            <Inbox className="text-white w-[30px]  p-1" />
          </button>
        </div>
      </div>
    </div>
  )
}
