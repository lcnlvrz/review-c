import { ReviewType, reviewTypesOpts } from '@/constants/review'
import { useDisclosure } from '@/hooks/useDisclosure'
import { ReviewSchema, reviewSchema } from '@/schemas/review.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-dropdown-menu'
import { Plus } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
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
import { useCallback, useState } from 'react'
import { ReviewService } from '@/services/review.service'
import { useError } from '@/hooks/useError'
import { useToast } from '@/hooks/useToast'
import { useQueryClient } from '@tanstack/react-query'
import { REVIEWS_QUERY_KEY } from '@/constants/query-keys'
import { useCurrentWorkspace } from '@/atoms/pageProps'

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

  console.log('methods', methods.formState.errors)

  return (
    <form onSubmit={methods.handleSubmit(onCreateReview)}>
      <div className="max-w-sm flex flex-col space-y-5">
        <div>
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
        </div>

        {fields.type === 'URL' && (
          <div>
            <Label>URL</Label>
            <Input
              placeholder="https://example.com"
              {...methods.register('url')}
            />
            {methods.formState.errors.url ? (
              <TextErrorMessage>
                {methods.formState.errors.url.message}
              </TextErrorMessage>
            ) : (
              <TextHelperMessage>
                Paste the URL of the page you want to review.
              </TextHelperMessage>
            )}
          </div>
        )}

        {fields.type === 'FILE' && (
          <UploadFile
            onUploadedFile={(token) => methods.setValue('file', token)}
          />
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
