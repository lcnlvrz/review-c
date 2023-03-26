import { GoogleLoginBtn } from '@/components/GoogleLoginBtn'
import { Logo } from '@/components/Logo'
import { useError } from '@/hooks/useError'
import { AuthProviders, AuthService } from '@/services/auth.service'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'

const login = () => {
  const router = useRouter()
  const error = useError()

  const onSignIn = useCallback((token: string, provider: AuthProviders) => {
    AuthService.singIn({
      token,
      provider,
    })
      .then((res) => {
        router.push('/')
      })
      .catch(error.handleError)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center items-center flex justify-center flex-col">
        <Logo size="lg" />
        <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="w-full items-center flex justify-center">
            <GoogleLoginBtn onConsent={onSignIn} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default login
