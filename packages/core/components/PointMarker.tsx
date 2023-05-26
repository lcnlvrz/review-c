import { useDisclosure } from '../hooks/useDisclosure'
import { useReview } from '../providers/ReviewProvider'
import { getContentShadowDomRef } from '../utils/get-content-shadow-dom-ref'
import { AbsoluteContainer } from './AbsoluteContainer'
import { MarkerAvatar } from './MarkerAvatar'
import { MessageContent } from './Message'
import { Thread } from './Thread'
import {
  composeUserName,
  discriminateMessages,
  type MessagePopulated,
} from 'common'
import type { Point, User } from 'database'
import { MessageCircle } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  cn,
} from 'ui'

interface CommonPointProps<TVisible extends boolean = true>
  extends Omit<Point, 'id' | 'createdById'> {
  createdAt: Date
  createdBy: User
  startedById?: number
  threadId?: number
  visible: TVisible
  xPath: string
  xPercentage: number
  yPercentage: number
  messages: Omit<MessagePopulated, 'id'>[]
}

export type MarkerPoint =
  | (CommonPointProps & {
      top: number
      left: number
    })
  | CommonPointProps<false>

export const PointMarker = (props: {
  point: Extract<MarkerPoint, { visible: true }>
  messages: MessagePopulated[]
  isStagedPoint?: boolean
}) => {
  const popover = useDisclosure()
  const tooltip = useDisclosure()

  const ctx = useReview()

  const { starterMessage } = discriminateMessages(props.messages)

  return (
    <div>
      {ctx.mustShowAbsoluteElements && (
        <div>
          <AbsoluteContainer point={props.point}>
            <div className="bg-white p-2 rounded-full shadow-lg border-gray-400 border">
              <MessageCircle className="-scale-x-1 text-primary" />
            </div>
          </AbsoluteContainer>
          <AbsoluteContainer
            point={{
              left: props.point.left + 25,
              top: props.point.top,
            }}
          >
            <MarkerAvatar
              src={props.point.createdBy.avatar}
              name={composeUserName(props.point.createdBy)}
            />
          </AbsoluteContainer>
        </div>
      )}

      {!props.isStagedPoint && (
        <>
          <TooltipProvider>
            <Tooltip
              onOpenChange={tooltip.setIsOpen}
              open={
                popover.isOpen || !ctx.mustShowAbsoluteElements
                  ? false
                  : tooltip.isOpen
              }
              delayDuration={0}
            >
              <TooltipTrigger asChild>
                <AbsoluteContainer
                  className={cn(`z-10 h-10 w-20`)}
                  point={props.point}
                />
              </TooltipTrigger>
              <TooltipContent
                className={'border border-gray-200 rounded-2xl w-96 p-4'}
                asChild
              >
                <MessageContent
                  onClick={() => {
                    popover.onOpen()
                    tooltip.onClose()
                  }}
                  className="cursor-pointer"
                  message={starterMessage}
                />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Popover
            open={popover.isOpen}
            onOpenChange={(open) => {
              if (!ctx.mustShowAbsoluteElements) return

              popover.setIsOpen(open)
              tooltip.onClose()
            }}
          >
            <PopoverTrigger asChild>
              <AbsoluteContainer
                className={cn(`z-1 h-10 w-20`)}
                point={props.point}
              />
            </PopoverTrigger>

            <PopoverContent
              className="border-none outline-none p-0"
              container={getContentShadowDomRef(ctx.PORTAL_SHADOW_ID)}
            >
              <Thread
                startedById={props.point.startedById}
                threadId={props.point.threadId}
                messages={props.messages}
                point={props.point}
              />
            </PopoverContent>
          </Popover>
        </>
      )}
    </div>
  )
}
