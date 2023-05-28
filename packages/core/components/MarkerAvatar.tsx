import { Avatar, AvatarFallback, AvatarImage, cn } from 'ui'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'ui'

export const MarkerAvatar = ({
  src,
  name,
  className,
}: {
  className?: string
  src: string
  name: string
}) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar className={cn('border border-gray-200', className)}>
            <AvatarImage src={src} alt="@shadcn" />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
