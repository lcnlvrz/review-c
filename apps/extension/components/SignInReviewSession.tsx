import { Label } from './Label'
import { WaitForQuery } from './WaitForQuery'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit } from 'lucide-react'
import { useCallback } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'ui'
import { Button } from 'ui'
import { useReviewSession } from '~hooks/useReviewSession'
import { useReviews } from '~hooks/useReviews'
import { useWorkspaces } from '~hooks/useWorkspaces'
import type { Host } from '~lib/resolve-host'
import { reviewSchema, type ReviewSchema } from '~schemas/review.schema'

export type DeepRequired<T> = {
  [K in keyof Required<T>]: Required<DeepRequired<T[K]>>
}

const useReviewForm = () => useFormContext<ReviewSchema>()

const WorkspaceSelect = () => {
  const methods = useReviewForm()

  const query = useWorkspaces()

  return (
    <WaitForQuery query={query}>
      {({ data }) => {
        return (
          <Select
            onValueChange={(workspaceId) => {
              const workspace = query.data.workspaces.find(
                (w) => w.id === workspaceId
              )
              methods.setValue('workspace', workspace)
            }}
          >
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

const ReviewSelect = (props: { host: Host }) => {
  const methods = useReviewForm()

  const query = useReviews({
    workspaceId: methods.getValues().workspace.id,
    host: props.host,
  })

  return (
    <WaitForQuery query={query}>
      {({ data }) => {
        return (
          <Select
            onValueChange={(reviewId) => {
              const review = query.data.reviews.find((r) => r.id === reviewId)

              methods.setValue('review', review)
            }}
          >
            <Label className="font-bold">Review</Label>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select an option" />
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

const Form = (props: { host: Host }) => {
  const methods = useReviewForm()
  const fields = methods.watch()

  const { startReviewSession } = useReviewSession(props.host.host)

  const onSubmit = useCallback((data: DeepRequired<ReviewSchema>) => {
    startReviewSession(data)
  }, [])

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className="flex flex-col space-y-10"
    >
      <div className="flex flex-col space-y-5">
        <WorkspaceSelect />
        {fields.workspace && <ReviewSelect host={props.host} />}
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

export const SignInReviewSession = (props: { host: Host }) => {
  const methods = useForm<ReviewSchema>({
    resolver: zodResolver(reviewSchema),
  })

  return (
    <FormProvider {...methods}>
      <Form host={props.host} />
    </FormProvider>
  )
}
