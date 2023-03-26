import { AuthService } from '@/services/auth.service'
import { User } from 'database'
import { SSFunction } from './compose'

export const withAuth: SSFunction<{ auth: User }> = async (_, cookie) => {
  try {
    const auth = await AuthService.fetchMe(cookie)

    return {
      props: {
        auth,
      },
    }
  } catch (err) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
}
