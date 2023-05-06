import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { GoogleLoginBtn } from 'ui'
import { SignInReviewSession } from '~components/SignInReviewSession'
import { WaitForHost } from '~components/WaitForHost'
import { useAuth } from '~hooks/useAuth'
import './styles.css'
import { API_BASE_URL, HttpClient } from 'clients'
import { SignOutReviewSession } from '~components/SignOutReviewSession'
import { useReviewSession } from '~hooks/useReviewSession'
import { HTTPClientProvider } from '~providers/HTTPClientProvider'

const Layout = (props: { host: string; token: string }) => {
  const [httpClient] = useState(
    new HttpClient(API_BASE_URL, {
      Cookie: `review-c_session=${props.token}`,
    })
  )

  const { currentReviewSession } = useReviewSession(props.host)

  return (
    <HTTPClientProvider httpClient={httpClient}>
      {!currentReviewSession ? (
        <SignInReviewSession host={props.host} />
      ) : (
        <SignOutReviewSession host={props.host} />
      )}
    </HTTPClientProvider>
  )
}

const ToggleReview = (props: { host: string }) => {
  const { auth, requestSignIn, token } = useAuth()

  return (
    <div className="flex items-center  justify-center w-[15rem] h-[20rem]">
      {!auth || !token ? (
        <GoogleLoginBtn onClick={requestSignIn} />
      ) : (
        <Layout token={token} host={props.host} />
      )}
    </div>
  )
}

function IndexPopup() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <WaitForHost>{({ host }) => <ToggleReview host={host} />}</WaitForHost>
    </QueryClientProvider>
  )
}

export default IndexPopup
