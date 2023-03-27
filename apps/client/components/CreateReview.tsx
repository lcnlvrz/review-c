import { useDisclosure } from '@/hooks/useDisclosure'
import { ReviewSchema, reviewSchema } from '@/schemas/review.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-dropdown-menu'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
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

export const CreateReview = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReviewSchema>({
    resolver: zodResolver(reviewSchema),
  })

  const fields = watch()

  console.log('fields', fields)

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

          <div className="max-w-sm flex flex-col space-y-5">
            <div>
              <Select onValueChange={(value) => setValue('type', value)}>
                <Label>Review Type</Label>
                <SelectTrigger className="m-0">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="file">File</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                </SelectContent>
              </Select>

              {errors.type && (
                <TextErrorMessage>{errors.type.message}</TextErrorMessage>
              )}
            </div>

            {fields.type === 'url' && (
              <div>
                <Label>URL</Label>
                <Input placeholder="https://example.com" {...register('url')} />
                {errors.url && (
                  <TextErrorMessage>{errors.url.message}</TextErrorMessage>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">Create review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
