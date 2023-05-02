import { Label } from './Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select'
import { WaitForQuery } from './WaitForQuery'
import { Button } from './button/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit } from 'lucide-react'
import { useCallback } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useIsReviewing } from '~hooks/useIsReviewing'
import { useReviews } from '~hooks/useReviews'
import { useWorkspaces } from '~hooks/useWorkspaces'
import { reviewSchema } from '~schemas/review.schema'

interface ReviewSchema {
  workspaceId: string
  reviewId: string
}

const useReviewForm = () => useFormContext<ReviewSchema>()

const WorkspaceSelect = () => {
  const methods = useReviewForm()

  const query = useWorkspaces()

  return (
    <WaitForQuery query={query}>
      {({ data }) => {
        return (
          <Select onValueChange={(v) => methods.setValue('workspaceId', v)}>
            <Label className="font-bold">Workspace</Label>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select one option" />
            </SelectTrigger>
            <SelectContent>
              {data.workspaces.map((workspace, index) => {
                return (
                  <SelectItem key={index} value={workspace.id}>
                    {workspace.name}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        )
      }}
    </WaitForQuery>
  )
}

const ReviewSelect = () => {
  const methods = useReviewForm()

  const query = useReviews({
    workspaceId: methods.getValues().workspaceId,
  })

  return (
    <WaitForQuery query={query}>
      {({ data }) => {
        return (
          <Select onValueChange={(v) => methods.setValue('reviewId', v)}>
            <Label className="font-bold">Review</Label>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              {data.reviews.map((review, index) => {
                return (
                  <SelectItem key={index} value={review.id}>
                    {review.title} / {review.type}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        )
      }}
    </WaitForQuery>
  )
}

const Form = (props: { host: string }) => {
  const methods = useReviewForm()
  const fields = methods.watch()

  const { toggleReview } = useIsReviewing(props.host)

  const onSubmit = useCallback((data: ReviewSchema) => {
    toggleReview()
  }, [])

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className="flex flex-col space-y-10"
    >
      <div className="flex flex-col space-y-5">
        <WorkspaceSelect />
        {fields.workspaceId && <ReviewSelect />}
      </div>

      <div>
        <Button type="submit" className="w-lg text-white w-full">
          <Edit className="w-[1rem] h-[1rem] mr-[10px]" />
          Start reviewing
        </Button>
      </div>
    </form>
  )
}

export const ReviewSelector = (props: { host: string }) => {
  const methods = useForm<ReviewSchema>({
    resolver: zodResolver(reviewSchema),
  })

  return (
    <FormProvider {...methods}>
      <Form host={props.host} />
    </FormProvider>
  )
}
