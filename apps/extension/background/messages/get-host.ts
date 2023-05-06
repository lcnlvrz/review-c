import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getHostFromURL } from "~lib/get-host"

const handler: PlasmoMessaging.Handler<
  "get-host",
  {},
  {
    host: string
  }
> = async (req, res) => {
  const host = await new Promise<string>((resolve) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const [mainTab] = tabs

      resolve(getHostFromURL(mainTab.url))
    })
  })

  res.send({
    host
  })
}

export default handler
