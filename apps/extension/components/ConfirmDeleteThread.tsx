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
import { useAPI } from '~hooks/useAPI'
import type { useDisclosure } from '~hooks/useDisclosure'
import { buildReviewDetailQueryKey } from '~hooks/useReviewDetail'
import { getContentShadowDomRef } from '~lib/get-content-shadow-dom-ref'
import { useReview } from '~providers/ReviewProvider'

export const ConfirmDeleteThread = (props: {
  ctrl: ReturnType<typeof useDisclosure>
  onClose: () => void
  threadId: number
}) => {
  const portal = getContentShadowDomRef()

  const reviewAPI = useAPI('review')
  const ctx = useReview()

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
