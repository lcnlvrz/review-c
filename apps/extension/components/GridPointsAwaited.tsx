import { WaitForQuery } from './WaitForQuery'
import { GridPoints } from 'core'
import { useReviewDetail } from '~hooks/useReviewDetail'
import type { Host } from '~lib/resolve-host'

export const GridPointsAwaited = (props: { host: Host }) => {
  const query = useReviewDetail({
    host: props.host,
  })

  return (
    <WaitForQuery query={query}>
      {({ data }) => <GridPoints threads={data.threads} />}
    </WaitForQuery>
  )
}
