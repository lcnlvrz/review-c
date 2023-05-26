import { useAuth, useCurrentWorkspace } from '@/atoms/pageProps'
import { BASE_URL_API } from '@/http/client'
import { useReviewDetail } from '@/providers/ReviewDetailProvider'
import { HttpClient } from 'clients'
import {
  GridPoints,
  HTTPClientProvider,
  InspectElementsLayer,
  InspectElementsProvider,
  ReviewProvider,
  Toolkit,
} from 'core'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Badge } from 'ui'

const FileViewer = dynamic(() => import('./FileViewer'), { ssr: false })

const FileReviewDetail = () => {
  const review = useReviewDetail()
  const auth = useAuth()
  const workspace = useCurrentWorkspace()

  const [httpClient] = useState(() => new HttpClient(BASE_URL_API))

  if (!review.file) {
    return
  }

  return (
    <>
      <Badge className="mt-5">{review.type}</Badge>
      <FileViewer
        src={review.file.url || ''}
        extension={review.file.originalFilename.split('.').pop() || ''}
      />
      <HTTPClientProvider httpClient={httpClient}>
        <ReviewProvider
          session={{
            review: {
              id: review.id,
              title: review.title,
            },
            workspace: {
              id: workspace.id,
              name: workspace.name,
            },
          }}
          auth={auth}
        >
          <InspectElementsProvider>
            <InspectElementsLayer />
            <GridPoints threads={review.threads} />
            <Toolkit />
          </InspectElementsProvider>
        </ReviewProvider>
      </HTTPClientProvider>
    </>
  )
}

export default FileReviewDetail
