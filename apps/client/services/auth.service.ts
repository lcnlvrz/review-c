import { httpClient } from '@/http/client'

export type AuthProviders = 'GOOGLE' | 'FACEBOOK'

export class AuthService {
  public static singIn(input: { token: string; provider: AuthProviders }) {
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
}
