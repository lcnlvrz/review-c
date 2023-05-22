import { Button } from './Button'
import { Input } from './Input'
import { TextErrorMessage } from './TextErrorMessage'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './Tooltip'
import type { Workspace } from '.prisma/client'
import { useError } from '@/hooks/useError'
import { useToast } from '@/hooks/useToast'
import { useWorkspace } from '@/hooks/useWorkspace'
import { emailSchema, EmailSchema } from '@/schemas/email.schema'
import type {
  invitationsSchema,
  InvitationsSchema,
} from '@/schemas/invitations.schema'
import { WorkspaceService } from '@/services/workspace.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, User, X } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { useFieldArray, useForm, UseFormSetError } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'ui'

const EmailForm = (props: {
  onSubmit: (
    data: EmailSchema,
    form: {
      onSuccess: () => void
      setError: UseFormSetError<EmailSchema>
    }
  ) => void
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setError,
  } = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
  })

  return (
    <form
      onSubmit={handleSubmit((data) => {
        props.onSubmit(data, {
          onSuccess: () => {
            reset()
          },
          setError,
        })
      })}
    >
      <div className="flex flex-row items-center space-x-2">
        <Input {...register('email')} />
        <Button type="submit">Add</Button>
      </div>

      {errors.email && (
        <TextErrorMessage>{errors.email.message}</TextErrorMessage>
      )}
    </form>
  )
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

const InvitationsForm = (props: Props) => {
  const { control, watch } = useForm<InvitationsSchema>({
    defaultValues: {
      invitations: [],
    },
  })

  const { append, remove } = useFieldArray({
    control,
    name: 'invitations',
  })

  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()

  const error = useError()

  const { currentWorkspace } = useWorkspace()

  const onInvite = useCallback(
    (data: InvitationsSchema) => {
      setIsLoading(true)

      WorkspaceService.invite(currentWorkspace.id, data)
        .then((res) => {
          toast({
            title: 'Invitations sent',
            description: 'Invitations sent successfully',
          })

          props.onClose()
        })
        .catch(error.handleError)
        .finally(() => setIsLoading(false))
    },
    [currentWorkspace.id]
  )

  const fields = watch()

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="emails" className="block font-medium text-gray-700">
            Email Address
          </label>
          <EmailForm
            onSubmit={(data, { onSuccess, setError }) => {
              const emailAlreadyAdded = fields.invitations.find(
                (user) => user.email === data.email
              )

              if (emailAlreadyAdded) {
                setError('email', {
                  message: 'Email already added',
                })
              }

              if (!emailAlreadyAdded) {
                append(data)
                onSuccess()
              }
            }}
          />
          <div className="mt-5">
            <h2 className="text-lg font-bold mb-4">Invitations</h2>
            {fields.invitations.length > 0 ? (
              <ul className="space-y-4">
                {fields.invitations.map((user, index) => (
                  <li key={user.email} className="flex items-center space-x-2">
                    <User />
                    <div className="flex flex-col">
                      <span className="text-gray-500">{user.email}</span>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => remove(index)}
                            variant="outline"
                            className="w-5 h-5 rounded-full p-0"
                          >
                            <X className="h-3 w-4" />
                            <span className="sr-only">Add</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove invitation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No invitations added</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            isLoading={isLoading}
            onClick={() => {
              onInvite(fields)
            }}
            disabled={!fields.invitations.length}
          >
            Invite members
          </Button>
        </div>
      </div>
    </div>
  )
}

export const InviteWorkspaceDialog = (props: Props) => {
  const { currentWorkspace } = useWorkspace()

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          props.onOpen()
        } else {
          props.onClose()
        }
      }}
      open={props.isOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-roboto">
            Invite people to {currentWorkspace.name}
          </DialogTitle>
          <DialogDescription>
            <InvitationsForm {...props} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
