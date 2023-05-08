import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HttpClient } from 'clients'
import cssText from 'data-text:~styles.css'
import { useState } from 'react'
import { ReviewToolkit } from '~components/ReviewToolkit'
import { WaitForHost } from '~components/WaitForHost'
import { useAuth } from '~hooks/useAuth'
import { useReviewSession, type ReviewSession } from '~hooks/useReviewSession'
import { HTTPClientProvider } from '~providers/HTTPClientProvider'
import { ReviewProvider } from '~providers/ReviewProvider'

export const getStyle = () => {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}

const Layout = (props: { token: string; session: ReviewSession }) => {
  const [httpClient] = useState(
    () =>
      new HttpClient(
        process.env.NEXT_PUBLIC_API_URL || process.env.PLASMO_PUBLIC_API_URL,
        {
          Cookie: `review-c_session=${props.token}`,
          Authorization: props.token,
        }
      )
  )

  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <HTTPClientProvider httpClient={httpClient}>
        <ReviewProvider session={props.session}>
          <ReviewToolkit />
        </ReviewProvider>
      </HTTPClientProvider>
    </QueryClientProvider>
  )
}

const Toolkit = (props: { host: string }) => {
  const { currentReviewSession } = useReviewSession(props.host)
  const { token } = useAuth()

  if (!currentReviewSession || !token) return null

  return <Layout token={token} session={currentReviewSession} />
}

const content = () => {
  return <WaitForHost>{({ host }) => <Toolkit host={host} />}</WaitForHost>
}

export default content
