import type { Invitation, Workspace } from 'database'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/Dialog'
import { INVITATIONS_QUERY_KEY } from '@/constants/query-keys'
import { useDisclosure, UseDisclosureReturn } from '@/hooks/useDisclosure'
import { WorkspaceService } from '@/services/workspace.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from './Button'
import { DialogHeader } from './Dialog'
import { ScrollArea } from './ScrollArea'
import { Skeleton } from './Skeleton'
import { SomethingWrongErr } from './SomethingWrongErr'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './AlertDialog'
import { useCallback, useState } from 'react'
import { useError } from '@/hooks/useError'
import { useToast } from '@/hooks/useToast'

interface AdditionalProps {
  currentWorkspace: Workspace
}

interface Props extends UseDisclosureReturn, AdditionalProps {}

const RevokeInvitation = (props: {
  invitation: Invitation
  workspaceId: string
}) => {
  const { onClose, isOpen, onOpen } = useDisclosure()

  const [isLoading, setIsLoading] = useState(false)

  const queryClient = useQueryClient()

  const error = useError()
  const { toast } = useToast()

  const onRevoke = useCallback(() => {
    setIsLoading(true)

    WorkspaceService.removeInvitation(props.workspaceId, props.invitation.id)
      .then((res) => {
        queryClient.invalidateQueries([INVITATIONS_QUERY_KEY])

        toast({
          title: 'Invitation revoked',
          description: 'The invitation has been revoked successfully',
        })

        onClose()
      })
      .catch(error.handleError)
      .finally(() => setIsLoading(false))
  }, [props.invitation.id, props.workspaceId])

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button onClick={onOpen} variant={'ghost'}>
          <span className="text-red-500">Revoke</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild disabled={isLoading} onClick={onRevoke}>
            <Button isLoading={isLoading}>Revoke invitation</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const Body = (props: Props) => {
  const { data, error, isLoading } = useQuery([INVITATIONS_QUERY_KEY], () =>
    WorkspaceService.listInvitations(props.currentWorkspace.nanoid)
  )

  if (isLoading) {
    return <Skeleton />
  }

  if (error || !data) {
    return <SomethingWrongErr />
  }

  return (
    <div>
      <p>There are {data?.invitations?.length} active invitations</p>
      <ScrollArea className="h-50">
        <ul className="flex flex-col space-y-2 mt-5">
          {data.invitations.map((invitation, index) => {
            return (
              <li
                key={index}
                className="flex flex-row items-center justify-between shadow-sm p-3 rounded"
              >
                <p>{invitation.email}</p>
                <RevokeInvitation
                  invitation={invitation}
                  workspaceId={props.currentWorkspace.nanoid}
                />
              </li>
            )
          })}
        </ul>
      </ScrollArea>
    </div>
  )
}

export const ManageInvitationsDialog = (props: Props) => {
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
          <DialogTitle className="font-roboto">Invitations</DialogTitle>
          <DialogDescription>
            <Body {...props} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
