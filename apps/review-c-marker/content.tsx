import { HttpClient } from 'clients'
import cssText from 'data-text:~styles.css'
import { useState } from 'react'
import { ReviewToolkit } from '~components/ReviewToolkit'
import { WaitForHost } from '~components/WaitForHost'
import { useAuth } from '~hooks/useAuth'
import { useIsReviewing } from '~hooks/useIsReviewing'
import { HTTPClientProvider } from '~providers/HTTPClientProvider'
import { ReviewProvider } from '~providers/ReviewProvider'

export const getStyle = () => {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}

const Layout = (props: { token: string }) => {
  const [httpClient] = useState(
    () =>
      new HttpClient(
        process.env.NEXT_PUBLIC_API_URL || process.env.PLASMO_PUBLIC_API_URL,
        {
          Cookie: `review-c_session=${props.token}`,
        }
      )
  )

  return (
    <HTTPClientProvider httpClient={httpClient}>
      <ReviewProvider>
        <ReviewToolkit />
      </ReviewProvider>
    </HTTPClientProvider>
  )
}

const Toolkit = (props: { host: string }) => {
  const { isReviewing } = useIsReviewing(props.host)
  const { token } = useAuth()

  if (!isReviewing || !token) return null

  return <Layout token={token} />
}

const content = () => {
  return <WaitForHost>{({ host }) => <Toolkit host={host} />}</WaitForHost>
}

export default content
