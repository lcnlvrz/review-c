import { GoogleLoginBtn } from '@/components/GoogleLoginBtn'
import { PublicLayout } from '@/components/PublicLayout'
import { useError } from '@/hooks/useError'
import { AuthProviders, AuthService } from '@/services/auth.service'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

const login = () => {
  const router = useRouter()
  const error = useError()

  const onSignIn = useCallback((token: string, provider: AuthProviders) => {
    AuthService.signIn({
      token,
      provider,
      ...router.query,
    })
      .then((res) => {
        router.push('/')
      })
      .catch(error.handleError)
  }, [])

  return (
    <PublicLayout title="Sign in to your account">
      <GoogleLoginBtn onConsent={onSignIn} />
    </PublicLayout>
  )
}

export default login
