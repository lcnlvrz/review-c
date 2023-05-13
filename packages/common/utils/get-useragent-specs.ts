import { isMobile } from './is-mobile'
import * as Bowser from 'bowser'

export const getUserAgentSpecs = (userAgent: string) => {
  const { browser, os } = Bowser.parse(userAgent)

  return {
    isMobile: isMobile(userAgent),
    browser: `${browser.name}${browser.version ? ' ' + browser.version : ''}`,
    os: `${os.name}${os.version ? ' ' + os.version : ''}`,
    ...(typeof window !== 'undefined'
      ? {
          windowHeight: window.innerHeight,
          windowWidth: window.innerWidth,
        }
      : {}),
  }
}
