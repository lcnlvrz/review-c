import { useAPI } from './useAPI'
import { useQuery } from '@tanstack/react-query'

const REVIEWS_QUERY_KEY = 'reviews'

export const useReviews = (props: { workspaceId: string }) => {
  const reviewAPI = useAPI('review')

  return useQuery(
    [REVIEWS_QUERY_KEY],
    () => reviewAPI.listReviews(props.workspaceId),
    {
      retry: 1,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )
}
