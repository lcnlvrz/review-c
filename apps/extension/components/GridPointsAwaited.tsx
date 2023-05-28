import { WaitForQuery } from './WaitForQuery'
import { GridMarkers } from 'core'
import { useReviewDetail } from '~hooks/useReviewDetail'
import type { Host } from '~lib/resolve-host'

export const GridPointsAwaited = (props: { host: Host }) => {
  const query = useReviewDetail({
    host: props.host,
  })

  return (
    <WaitForQuery query={query}>
      {({ data }) => <GridMarkers threads={data.threads} />}
    </WaitForQuery>
  )
}
