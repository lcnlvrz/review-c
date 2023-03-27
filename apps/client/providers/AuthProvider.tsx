import type { User } from 'database'
import { createContext } from 'react'

interface AuthContext {
  auth: User
}

export const AuthContext = createContext<AuthContext>({
  auth: {} as any,
})

export const AuthProvider = (props: React.PropsWithChildren<AuthContext>) => {
  return (
    <AuthContext.Provider
      value={{
        auth: props.auth,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
