import { AuthProviders } from '@/services/auth.service'
import {
  GoogleLogin,
  GoogleOAuthProvider,
  useGoogleLogin,
} from '@react-oauth/google'
import { useEffect } from 'react'

interface Props {
  onConsent: (token: string, provider: AuthProviders) => void
}

const GoogleAuth = (props: Props) => {
  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: (credentialResponse) => {
      if (credentialResponse.access_token) {
        props.onConsent(credentialResponse.access_token, 'GOOGLE')
      }
    },
  })

  return (
    <button
      onClick={() => googleLogin()}
      className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex items-center"
    >
      <svg
        className="w-4 h-4 mr-2 -ml-1"
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="google"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 488 512"
      >
        <path
          fill="currentColor"
          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
        ></path>
      </svg>
      Sign in with Google
    </button>
  )
}

export const GoogleLoginBtn = (props: Props) => {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
    >
      <GoogleAuth {...props} />
    </GoogleOAuthProvider>
  )
}
