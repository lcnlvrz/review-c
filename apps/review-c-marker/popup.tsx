import { GoogleLoginBtn } from 'ui'
import { ReviewSelector } from '~components/ReviewSelector'
import { WaitForHost } from '~components/WaitForHost'
import { useAuth } from '~hooks/useAuth'
import { useIsReviewing } from '~hooks/useIsReviewing'
import './styles.css'

const ToggleReview = (props: { host: string }) => {
  const { isReviewing, toggleReview } = useIsReviewing(props.host)

  console.log('isReviewing', isReviewing)

  const { auth, requestSignIn, setAuth } = useAuth()

  return (
    <div className="flex items-center  justify-center w-[15rem] h-[15rem]">
      {!auth ? (
        <GoogleLoginBtn onClick={requestSignIn} />
      ) : (
        <ReviewSelector host={props.host} />
      )}
    </div>
  )
}

function IndexPopup() {
  return <WaitForHost>{({ host }) => <ToggleReview host={host} />}</WaitForHost>
}

export default IndexPopup
