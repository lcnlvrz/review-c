import { useAPI } from './useAPI'
import { useQuery } from '@tanstack/react-query'

const WORKSPACES_QUERY_KEY = 'workspaces'

export const useWorkspaces = () => {
  const workspaceAPI = useAPI('workspace')

  return useQuery([WORKSPACES_QUERY_KEY], () => workspaceAPI.list(), {
    retry: 1,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}
