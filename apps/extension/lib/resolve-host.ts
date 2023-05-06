export const resolveHost = () => {
  return new Promise<string>((resolve) => {
    //This indicates that context is the same page (content scripts)
    if (typeof chrome.tabs === "undefined") {
      resolve(window.location.host)
    }

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const [mainTab] = tabs

      if (mainTab) {
        const url = new URL(mainTab.url)
        resolve(url.host)
      }
    })
  })
}
