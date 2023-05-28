import { useAPI } from 'core'
import { useQuery } from '@tanstack/react-query'
import type { Host } from '~lib/resolve-host'

const REVIEWS_QUERY_KEY = 'reviews'

export const useReviews = (props: { workspaceId: string; host: Host }) => {
  const reviewAPI = useAPI('review')

  return useQuery(
    [REVIEWS_QUERY_KEY],
    () => reviewAPI.listReviews(props.workspaceId, props.host.origin),
    {
      retry: 1,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )
}
