import type { Workspace } from '.prisma/client'
import { UserPlus } from 'lucide-react'
import { DropdownMenuItem } from './DropdownMenu'

export const InvitePeopleTrigger = (props: {
  currentWorkspace: Workspace
  onOpen: () => void
}) => {
  return (
    <>
      <DropdownMenuItem onClick={props.onOpen}>
        <span className="truncate font-montserrat">
          Invite people to {props.currentWorkspace.name}
        </span>
      </DropdownMenuItem>
    </>
  )
}
