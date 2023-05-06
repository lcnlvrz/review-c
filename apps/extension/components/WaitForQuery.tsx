import { Spinner } from './Spinner'
import type { UseQueryResult } from '@tanstack/react-query'

export const WaitForQuery = <T extends unknown>(props: {
  query: UseQueryResult<T>
  children: React.FC<{
    data: T
  }>
}) => {
  if (props.query.isLoading) {
    return <Spinner />
  }

  if (props.query.error || !props.query.data) {
    return (
      <div>
        <p>Something went wrong</p>
      </div>
    )
  }

  return props.children({
    data: props.query.data,
  })
}
