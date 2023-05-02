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
    const { access_token } = await AuthClient.signIn({
      provider: 'GOOGLE',
      token,
    })

    const auth = await AuthClient.fetchMe(token)

    storage.set('auth', auth)
    storage.set('access_token', access_token)

    response.send({
      success: true,
    })
  } catch (err) {
    console.log(err)
    response.send({
      success: false,
    })
  }
}

export default handler
