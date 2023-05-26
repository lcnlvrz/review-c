import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HttpClient } from 'clients'
import {
  InspectElementsProvider,
  ReviewProvider,
  Toolkit,
  HTTPClientProvider,
  InspectElementsLayer,
} from 'core'
import cssText from 'data-text:~/styles.css'
import type { User } from 'database'
import { useState } from 'react'
import { GridPointsAwaited } from '~components/GridPointsAwaited'
import { PORTAL_ID, WaitForHost } from '~components/WaitForHost'
import { useAuth } from '~hooks/useAuth'
import { useReviewSession, type ReviewSession } from '~hooks/useReviewSession'
import type { Host } from '~lib/resolve-host'

export const getStyle = () => {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.PLASMO_PUBLIC_API_URL

const Layout = (props: {
  auth: User
  token: string
  session: ReviewSession
  host: Host
}) => {
  const [httpClient] = useState(
    () =>
      new HttpClient(API_BASE_URL, {
        Cookie: `review-c_session=${props.token}`,
        Authorization: props.token,
      })
  )

  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <HTTPClientProvider httpClient={httpClient}>
        <ReviewProvider
          PORTAL_SHADOW_ID={PORTAL_ID}
          session={props.session}
          auth={props.auth}
        >
          <InspectElementsProvider>
            <InspectElementsLayer />
            <Toolkit />
            <GridPointsAwaited host={props.host} />
          </InspectElementsProvider>
        </ReviewProvider>
      </HTTPClientProvider>
    </QueryClientProvider>
  )
}

const ReviewContainer = (props: { host: Host }) => {
  const { currentReviewSession } = useReviewSession(props.host.host)
  const { token, auth } = useAuth()

  if (!currentReviewSession || !token) return null

  return (
    <Layout
      host={props.host}
      auth={auth}
      token={token}
      session={currentReviewSession}
    />
  )
}

const content = () => {
  return (
    <WaitForHost>{({ host }) => <ReviewContainer host={host} />}</WaitForHost>
  )
}

export default content
