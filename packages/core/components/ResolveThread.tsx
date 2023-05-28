import { useAPI } from '../hooks/useAPI'
import { useReview } from '../providers/ReviewProvider'
import { buildReviewDetailQueryKey } from '../utils/query-key-builders'
import { useQueryClient } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import { useCallback, useState } from 'react'
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'ui'

export const ResolveThread = (props: { threadId: number }) => {
  const [isLoading, setIsLoading] = useState(false)

  const reviewAPI = useAPI('review')
  const ctx = useReview()
  const queryClient = useQueryClient()

  const onResolveThread = useCallback(() => {
    setIsLoading(true)

    reviewAPI
      .resolveThread(
        ctx.reviewSession.workspace.id,
        ctx.reviewSession.review.id,
        props.threadId
      )
      .then(() => {
        queryClient.invalidateQueries([
          buildReviewDetailQueryKey(ctx.reviewSession.review.id),
        ])
      })
      .finally(() => setIsLoading(false))
  }, [props.threadId])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={isLoading}
            onClick={onResolveThread}
            size="sm"
            className="outline-0 border-none hover:bg-gray-100 rounded-lg"
            variant="ghost"
          >
            <Check />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Resolve thread</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
