export interface Host {
  origin: string
  host: string
  href: string
  pathname: string
}

export const resolveHost = () => {
  return new Promise<Host>((resolve) => {
    //This indicates that context is the same page (content scripts)
    if (typeof chrome.tabs === 'undefined') {
      resolve(window.location)
    }

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const [mainTab] = tabs

      if (mainTab) {
        resolve(new URL(mainTab.url))
      }
    })
  })
}
