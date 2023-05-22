import type { SSFunction } from './compose'
import { AuthService } from '@/services/auth.service'
import type { User } from 'database'

export const withAuth = (
  redirectQueryParams?: Record<string, string>
): SSFunction<{ auth: User }> => {
  return async (ctx, cookie) => {
    try {
      const auth = await AuthService.fetchMe(cookie)

      return {
        props: {
          auth,
        },
      }
    } catch (err) {
      if (redirectQueryParams) {
        const url = new URLSearchParams()

        Object.entries(redirectQueryParams).forEach(([key, value]) => {
          url.append(key, value)
        })

        return {
          redirect: {
            destination: `/sign-in?${url.toString()}`,
            permanent: false,
          },
        }
      }

      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      }
    }
  }
}
