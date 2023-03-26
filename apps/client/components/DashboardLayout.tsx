import { useDisclosure } from '@/hooks/useDisclosure'
import { montserrat } from '@/pages/_app'
import { Circle, Plus, UserPlus } from 'lucide-react'
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
import { InvitePeopleTrigger } from './InvitePeopleTrigger'
import { InviteWorkspaceDialog } from './InviteWorkspaceDialog'
import { ManageInvitationsDialog } from './ManageInvitationsDialog'
import type { User, Workspace } from 'database'

export const DashboardLayout = (
  props: React.PropsWithChildren<{
    auth: User
    currentWorkspace: Workspace
    workspaces: Workspace[]
  }>
) => {
  const invitePeopleDisclosure = useDisclosure()
  const manageMembersDisclosure = useDisclosure()
  const manageInvitationsDisclosure = useDisclosure()

  return (
    <div className="">
      <div className="h-16 bg-gray-300 flex items-center justify-between px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="font-bold hover:text-blue-500 transition-all">
              {props.currentWorkspace.name}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <InvitePeopleTrigger
                {...invitePeopleDisclosure}
                currentWorkspace={props.currentWorkspace}
              />

              {/* TODO: LIMIT OPTIONS BASED ON MEMBER ROLE */}
              <DropdownMenuItem onClick={manageInvitationsDisclosure.onOpen}>
                <span className="truncate">Manage invitations</span>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <span className="truncate">Manage members</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel className={`${montserrat.variable} font-sans`}>
                ALL WORKSPACES
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                {props.workspaces.map((workspace) => {
                  return (
                    <DropdownMenuItem key={workspace.id}>
                      <Circle className="mr-2 h-4 w-4 text-green-300" />
                      <span>{workspace.name}</span>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuGroup>
              <Button className="font-bold" variant={'ghost'} size={'sm'}>
                <Plus className="mr-2 h-4 w-4 text-black" />
                Create Workspace
              </Button>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <InviteWorkspaceDialog
          {...invitePeopleDisclosure}
          currentWorkspace={props.currentWorkspace}
        />
        <ManageInvitationsDialog
          {...manageInvitationsDisclosure}
          currentWorkspace={props.currentWorkspace}
        />
      </div>
      {props.children}
    </div>
  )
}
