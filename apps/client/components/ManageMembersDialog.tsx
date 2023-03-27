import { MEMBERS_QUERY_KEY } from '@/constants/query-keys'
import { useAuth } from '@/hooks/useAuth'
import { useDisclosure, UseDisclosureReturn } from '@/hooks/useDisclosure'
import { useError } from '@/hooks/useError'
import { useToast } from '@/hooks/useToast'
import { useWorkspace } from '@/hooks/useWorkspace'
import { MemberWithUser, WorkspaceService } from '@/services/workspace.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import Fuse from 'fuse.js'
import { ChevronDown, Minus, SearchIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './AlertDialog'
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'
import { Button } from './Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './Dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu'
import { Input } from './Input'
import { InviteWorkspaceDialog } from './InviteWorkspaceDialog'
import { Separator } from './Separator'
import { Skeleton } from './Skeleton'
import { SomethingWrongErr } from './SomethingWrongErr'
import { Table } from './Table'

interface Props extends UseDisclosureReturn {}

const RemoveFromWorkspaceDialog = (
  props: {
    member: MemberWithUser
  } & UseDisclosureReturn
) => {
  const [isLoading, setIsLoading] = useState(false)

  const error = useError()

  const { toast } = useToast()

  const queryClient = useQueryClient()

  const { currentWorkspace } = useWorkspace()

  const onRemoveMember = useCallback(() => {
    setIsLoading(true)

    WorkspaceService.removeMember(currentWorkspace.id, props.member.id)
      .then((res) => {
        queryClient.invalidateQueries([MEMBERS_QUERY_KEY])

        toast({
          title: 'Member removed',
          description: 'Member has been removed from the workspace',
        })

        props.onClose()
      })
      .catch(error.handleError)
      .finally(() => setIsLoading(false))
  }, [currentWorkspace.id])

  return (
    <AlertDialog open={props.isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove{' '}
            <strong>{props.member.user.email}</strong> from the workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} onClick={props.onClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={onRemoveMember} isLoading={isLoading}>
              Remove
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const RoleCellRender = (props: { member: MemberWithUser }) => {
  const removeMemberDisclosure = useDisclosure()

  const { auth } = useAuth()

  const { currentWorkspace } = useWorkspace()

  if (
    auth.id === props.member.user.id ||
    currentWorkspace.member.role !== 'ADMIN'
  ) {
    return <p>{props.member.role}</p>
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <ChevronDown />
            {props.member.role}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={removeMemberDisclosure.onOpen}>
              <Minus className="mr-2 h-4 w-4" />
              <span>Remove from workspace</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <RemoveFromWorkspaceDialog
        member={props.member}
        {...removeMemberDisclosure}
      />
    </div>
  )
}

const Body = () => {
  const { currentWorkspace } = useWorkspace()

  const { isLoading, data, error } = useQuery([MEMBERS_QUERY_KEY], () =>
    WorkspaceService.listMembers(currentWorkspace.id)
  )

  const [matches, setMatches] = useState<MemberWithUser[]>(data?.members || [])

  const inviteMembersDisclosure = useDisclosure()

  const columns = useMemo<ColumnDef<MemberWithUser>[]>(
    () => [
      {
        header: 'Name',
        cell: ({ row }) => (
          <div className="flex flex-row space-x-2 p-4">
            <Avatar>
              <AvatarImage src={row.original.user.avatar} />
              <AvatarFallback className="uppercase">
                {row.original.user.firstName}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-bold text-black">
                {row.original.user.firstName} {row.original.user.lastName}
              </p>
              <p className="text-gray-500">{row.original.user.email}</p>
            </div>
          </div>
        ),
      },
      {
        header: 'Role',
        cell: ({ row }) => <RoleCellRender member={row.original} />,
      },
    ],
    []
  )

  const fuse = new Fuse(data?.members || [], {
    keys: ['user.firstName', 'user.lastName', 'user.email'],
  })

  useEffect(() => {
    if (data) {
      setMatches(data.members)
    }
  }, [data])

  if (isLoading) {
    return <Skeleton />
  }

  if (error || !data) {
    return <SomethingWrongErr />
  }

  return (
    <div className="flex flex-col space-y-5">
      <div className="flex flex-row justify-between">
        <div className="grid grid-cols-5 items-center">
          <p className="col-span-2">{`All members (${data?.members.length})`}</p>
          <div className="col-span-3">
            <Input
              onChange={(e) => {
                if (!e.target.value) {
                  setMatches(data.members)
                }

                if (e.target.value) {
                  const results = fuse.search(e.target.value)

                  setMatches(results.map((result) => result.item))
                }
              }}
              className="pl-9"
              leftIcon={<SearchIcon className="w-4 h-4 text-gray-500" />}
              placeholder="Search members"
            />
          </div>
        </div>
        {currentWorkspace.member.role === 'ADMIN' && (
          <Button onClick={inviteMembersDisclosure.onOpen}>
            Invite New Members
          </Button>
        )}
      </div>
      <Separator />
      <Table data={matches} columns={columns} />
      <InviteWorkspaceDialog {...inviteMembersDisclosure} />
    </div>
  )
}

export const ManageMembersDialog = (props: Props) => {
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
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Members</DialogTitle>
          <DialogDescription>
            <Body />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
