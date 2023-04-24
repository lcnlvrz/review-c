import type { PlasmoMessaging } from '@plasmohq/messaging'
import { AuthClient } from 'clients'
import { storage } from '~background'

const getGoogleToken = async (): Promise<string> => {
  return await new Promise((resolve) => {
    chrome.identity.getAuthToken({ interactive: true }, resolve)
  })
}

const handler: PlasmoMessaging.Handler<
  'google-sign-in',
  {},
  { success: boolean }
> = async (_, response) => {
  const token = await getGoogleToken()

  try {
    const auth = await AuthClient.signIn({
      provider: 'GOOGLE',
      token,
    })

    storage.set('auth', auth)
    storage.set('access_token', token)

    response.send({
      success: true,
    })
  } catch (err) {
    response.send({
      success: false,
    })
  }
}

export default handler
