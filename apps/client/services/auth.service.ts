import type { Invitation } from '.prisma/client'
import { httpClient } from '@/http/client'

export type AuthProviders = 'GOOGLE' | 'FACEBOOK'

export class AuthService {
  public static signIn(input: { token: string; provider: AuthProviders }) {
    return httpClient.post('/auth/sign-in', input)
  }

  public static fetchMe(cookie?: string) {
    return httpClient
      .get('/auth/me', {
        headers: {
          Cookie: cookie,
        },
      })
      .then((res) => res.data)
  }

  public static listInvitations(
    cookie?: string
  ): Promise<{ invitations: Invitation[] }> {
    return httpClient
      .get('/auth/me/invitation', {
        headers: {
          Cookie: cookie,
        },
      })
      .then((res) => res.data)
  }

  public static signOut() {
    return httpClient.get('/auth/sign-out').then((res) => res.data)
  }
}
