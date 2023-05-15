import { Button } from './Button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './Dialog'
import { Input } from './Input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './Select'
import { TextErrorMessage } from './TextErrorMessage'
import { TextHelperMessage } from './TextHelperMessage'
import { UploadFile } from './UploadFile'
import { useCurrentWorkspace } from '@/atoms/pageProps'
import { REVIEWS_QUERY_KEY } from '@/constants/query-keys'
import { ReviewType, reviewTypesOpts } from '@/constants/review'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useError } from '@/hooks/useError'
import { useToast } from '@/hooks/useToast'
import { ReviewSchema, reviewSchema } from '@/schemas/review.schema'
import { ReviewService } from '@/services/review.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-dropdown-menu'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

const Body = (props: { onClose: () => void }) => {
  const [isLoading, setIsLoading] = useState(false)

  const workspace = useCurrentWorkspace()

  const methods = useForm<ReviewSchema>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      type: 'FILE',
    },
  })

  const queryClient = useQueryClient()

  const fields = methods.watch()

  const { handleError } = useError()

  const { toast } = useToast()

  const onCreateReview = useCallback(
    (data: ReviewSchema) => {
      setIsLoading(true)

      ReviewService.createReview(workspace.id, data)
        .then((res) => {
          queryClient.invalidateQueries([REVIEWS_QUERY_KEY])

          toast({
            title: 'Review created',
            description: 'Your review has been created successfully',
          })

          props.onClose()
        })
        .catch(handleError)
        .finally(() => {
          setIsLoading(false)
        })
    },
    [workspace.id]
  )

  console.log('methods.formState.errors', methods.formState.errors)
  console.log('fields', fields)

  return (
    <form onSubmit={methods.handleSubmit(onCreateReview)}>
      <div className="max-w-sm flex flex-col space-y-5">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="Review"
            {...methods.register('title')}
          />
          {methods.formState.errors.title && (
            <TextErrorMessage>
              {methods.formState.errors.title.message}
            </TextErrorMessage>
          )}
        </div>
        <Select
          value={fields.type}
          onValueChange={(value) =>
            methods.setValue('type', value as ReviewType)
          }
        >
          <SelectTrigger className="m-0">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {reviewTypesOpts.map(({ label, type, context }) => {
                return (
                  <SelectItem key={type} value={type}>
                    <span className="flex flex-col item-start justify-start text-start">
                      {label}
                      <span className="text-xs text-gray-600">{context}</span>
                    </span>
                  </SelectItem>
                )
              })}
            </SelectGroup>
            <SelectSeparator />
          </SelectContent>
        </Select>

        {methods.formState.errors.type && (
          <TextErrorMessage>
            {methods.formState.errors.type.message}
          </TextErrorMessage>
        )}

        {fields.type === 'WEBSITE' && (
          <div>
            <Label>Website</Label>
            <div className="flex flex-row items-center">
              <span className="bg-gray-100 flex h-10 rounded-l-md border border-slate-200 py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 ">
                https://
              </span>
              <Input
                className="rounded-l-none"
                placeholder="baratin.lcnlvrz.com"
                {...methods.register('website', {
                  setValueAs: (val) => `https://${val}`,
                })}
              />
            </div>

            {'website' in methods.formState.errors &&
            methods.formState.errors.website ? (
              <TextErrorMessage>
                {methods.formState.errors.website.message}
              </TextErrorMessage>
            ) : (
              <TextHelperMessage>
                Paste the URL of the page you want to review.
              </TextHelperMessage>
            )}
          </div>
        )}

        {fields.type === 'FILE' && (
          <>
            <UploadFile
              onUploadedFile={(token) => methods.setValue('file', token)}
            />
            {'file' in methods.formState.errors &&
              methods.formState.errors.file && (
                <TextErrorMessage>
                  {methods.formState.errors.file.message}
                </TextErrorMessage>
              )}
          </>
        )}
      </div>

      <DialogFooter className="mt-5">
        <Button isLoading={isLoading} type="submit">
          Create review
        </Button>
      </DialogFooter>
    </form>
  )
}

export const CreateReview = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>
        <Plus className="mr-2" />
        Create review
      </Button>
      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            onClose()
          }

          if (open) {
            onOpen()
          }
        }}
        open={isOpen}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create review</DialogTitle>
          </DialogHeader>
          <Body onClose={onClose} />
        </DialogContent>
      </Dialog>
    </>
  )
}
