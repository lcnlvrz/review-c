import cssText from 'data-text:~styles.css'
import { ReviewToolkit } from '~components/ReviewToolkit'
import { WaitForHost } from '~components/WaitForHost'
import { useIsReviewing } from '~hooks/useIsReviewing'
import { ReviewProvider } from '~providers/ReviewProvider'

export const getStyle = () => {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}

const Layout = (props: { host: string }) => {
  const { isReviewing, toggleReview } = useIsReviewing(props.host)

  if (!isReviewing) {
    return null
  }

  return (
    <ReviewProvider>
      <ReviewToolkit />
    </ReviewProvider>
  )
}

const content = () => {
  return (
    <WaitForHost>
      {({ host }) => {
        return <Layout host={host} />
      }}
    </WaitForHost>
  )
}

export default content
