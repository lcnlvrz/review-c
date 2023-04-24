import type { User } from '.prisma/client'
import { sendToBackground } from '@plasmohq/messaging'
import { useStorage } from '@plasmohq/storage/hook'
import { useCallback, useState } from 'react'

export const useAuth = () => {
  const [auth, setAuth] = useStorage<User>(`auth`)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState(false)

  const requestSignIn = useCallback(() => {
    setIsAuthenticating(true)

    sendToBackground<any, { success: boolean }>({
      name: 'google-sign-in',
    })
      .then((res) => {
        if (!res.success) {
          setError(true)
        }

        if (res.success) {
          setError(false)
        }
      })
      .finally(() => setIsAuthenticating(false))
  }, [])

  return {
    auth,
    setAuth,
    requestSignIn,
    isAuthenticating,
    error,
  }
}
