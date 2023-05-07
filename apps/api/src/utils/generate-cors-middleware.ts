import { Handler } from 'express'

export const generateCorsMiddleware =
  (routes: string[]): Handler =>
  (req, res, next) => {
    console.log('req.path', req.path)

    if (routes.includes(req.path)) {
      res.header('Access-Control-Allow-Headers', '*')
      res.header('Access-Control-Allow-Origin', '*')

      if (req.method === 'OPTIONS') {
        res.status(200).send()
        return
      }
    }

    next()
  }
