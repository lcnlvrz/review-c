import { WorkspaceContext } from '@/providers/WorkspaceProvider'
import { useContext } from 'react'

export const useWorkspace = () => useContext(WorkspaceContext)
