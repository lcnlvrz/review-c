import { useAPI } from '../hooks/useAPI'
import { useDisclosure } from '../hooks/useDisclosure'
import { useReview } from '../providers/ReviewProvider'
import { getContentShadowDomRef } from '../utils/get-content-shadow-dom-ref'
import { buildReviewDetailQueryKey } from '../utils/query-key-builders'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'ui'

export const ConfirmDeleteThread = (props: {
  ctrl: ReturnType<typeof useDisclosure>
  onClose: () => void
  threadId: number
}) => {
  const reviewAPI = useAPI('review')
  const ctx = useReview()

  const portal = getContentShadowDomRef(ctx.PORTAL_SHADOW_ID)

  const queryClient = useQueryClient()

  const onDeleteThread = useCallback(() => {
    reviewAPI
      .deleteThread(
        ctx.reviewSession.workspace.id,
        ctx.reviewSession.review.id,
        props.threadId
      )
      .then((res) => {
        queryClient.invalidateQueries([
          buildReviewDetailQueryKey(ctx.reviewSession.review.id),
        ])

        props.onClose()
      })
  }, [props.threadId])

  return (
    <AlertDialog open={props.ctrl.isOpen} onOpenChange={props.ctrl.setIsOpen}>
      <AlertDialogContent className="bg-white border-0" container={portal}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            thread
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-0">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDeleteThread}
            className="rounded-lg text-white"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
