import { Button } from './Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu'
import { InviteWorkspaceDialog } from './InviteWorkspaceDialog'
import { ManageInvitationsDialog } from './ManageInvitationsDialog'
import { ManageMembersDialog } from './ManageMembersDialog'
import { UserAvatar } from './UserAvatar'
import { useAuth } from '@/hooks/useAuth'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useError } from '@/hooks/useError'
import { useWorkspace } from '@/hooks/useWorkspace'
import { montserrat } from '@/pages/_app'
import { AuthService } from '@/services/auth.service'
import { cn } from '@/utils/cn'
import { useQueryClient } from '@tanstack/react-query'
import type { Workspace } from 'database'
import { Circle, LogOut, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

export const DashboardLayout = (
  props: React.PropsWithChildren<{
    workspaces: Workspace[]
  }>
) => {
  const invitePeopleDisclosure = useDisclosure()
  const manageMembersDisclosure = useDisclosure()
  const manageInvitationsDisclosure = useDisclosure()

  const { currentWorkspace } = useWorkspace()

  const { auth } = useAuth()

  const queryClient = useQueryClient()

  const router = useRouter()

  const error = useError()

  const onLogout = useCallback(() => {
    AuthService.signOut()
      .then((res) => {
        queryClient.clear()
        router.push('/')
      })
      .catch(error.handleError)
  }, [])

  return (
    <div className="">
      <div className="h-16 bg-gray-300 flex items-center justify-between px-4">
        <div className="flex flex-row justify-between items-center w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="font-bold hover:text-blue-500 transition-all">
                {currentWorkspace.name}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                {currentWorkspace.member.role === 'ADMIN' && (
                  <DropdownMenuItem onClick={invitePeopleDisclosure.onOpen}>
                    <span className="truncate font-montserrat">
                      Invite people to {currentWorkspace.name}
                    </span>
                  </DropdownMenuItem>
                )}

                {/* TODO: LIMIT OPTIONS BASED ON MEMBER ROLE */}
                <DropdownMenuItem onClick={manageInvitationsDisclosure.onOpen}>
                  <span className="truncate">Invitations</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={manageMembersDisclosure.onOpen}>
                  <span className="truncate">Members</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel
                  className={`${montserrat.variable} font-sans`}
                >
                  ALL WORKSPACES
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  {props.workspaces.map((workspace) => {
                    const isCurrentWorkspace =
                      currentWorkspace.id === workspace.id

                    return (
                      <Link
                        key={workspace.id}
                        href={`/workspace/${workspace.id}`}
                      >
                        <DropdownMenuItem
                          className="flex flex-row space-x-2 items-center"
                          key={workspace.id}
                        >
                          <Circle
                            className={cn('h-4 w-4 ', {
                              'text-green-300 fill-green-300':
                                isCurrentWorkspace,
                              'text-gray-300 ': !isCurrentWorkspace,
                            })}
                          />

                          <span>{workspace.name}</span>
                        </DropdownMenuItem>
                      </Link>
                    )
                  })}
                </DropdownMenuGroup>
                <Link href={'/workspace/create'}>
                  <Button
                    className="font-bold w-full"
                    variant={'ghost'}
                    size={'sm'}
                  >
                    <Plus className="mr-2 h-4 w-4 text-black" />
                    Create Workspace
                  </Button>
                </Link>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <UserAvatar user={auth} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4 text-black" />
                <span className="truncate">Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <InviteWorkspaceDialog {...invitePeopleDisclosure} />
        <ManageInvitationsDialog {...manageInvitationsDisclosure} />
        <ManageMembersDialog {...manageMembersDisclosure} />
      </div>
      <div className="p-10">{props.children}</div>
    </div>
  )
}
