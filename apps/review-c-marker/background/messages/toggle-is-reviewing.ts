import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const handler: PlasmoMessaging.MessageHandler<{
  isReviewing: boolean
}> = async (req, res) => {
  const storage = new Storage()

  res.send({
    isReviewing: req.body.isReviewing
  })
}

export default handler
