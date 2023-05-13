import { Avatar, AvatarFallback, AvatarImage } from './avatar/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'ui'

export const MarkerAvatar = ({ src, name }: { src: string; name: string }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar className="border border-gray-200">
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
