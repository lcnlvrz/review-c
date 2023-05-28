import { sendToBackground } from '@plasmohq/messaging'
import { useStorage } from '@plasmohq/storage/hook'
import type { User } from 'database'
import { useCallback, useState } from 'react'

export const useAuth = () => {
  const [auth, setAuth, { remove }] = useStorage<User>(`auth`)
  const [token] = useStorage<string>(`access_token`)
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

  const logout = useCallback(() => remove(), [])

  return {
    logout,
    auth,
    setAuth,
    requestSignIn,
    isAuthenticating,
    error,
    token,
  }
}
