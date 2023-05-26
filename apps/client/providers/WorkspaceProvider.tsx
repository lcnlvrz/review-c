import type { Member, Workspace } from 'database'
import { createContext } from 'react'

export type WorkspaceWithMember = Workspace & { member: Member }

interface WorkspaceContext {
  currentWorkspace: WorkspaceWithMember
}

export const WorkspaceContext = createContext<WorkspaceContext>({
  currentWorkspace: {} as any,
})

export const WorkspaceProvider = (
  props: React.PropsWithChildren<WorkspaceContext>
) => {
  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace: props.currentWorkspace,
      }}
    >
      {props.children}
    </WorkspaceContext.Provider>
  )
}
