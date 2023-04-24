import { httpClient } from './http.client'
import type { User } from '.prisma/client'

export type AuthProviders = 'GOOGLE' | 'FACEBOOK'

export class AuthClient {
  public static signIn(input: { token: string; provider: AuthProviders }) {
    return httpClient
      .post<{
        access_token: string
      }>('/auth/sign-in', input)
      .then((res) => res.data)
  }

  public static fetchMe(token?: string) {
    return httpClient
      .get<User>('/auth/sign-in', {
        Cookie: `review-c_session=${token}`,
      })
      .then((res) => res.data)
  }
}
