import { Handler, Response } from 'express'

const wcmatch = require('wildcard-match')

export const setCorsHeaders = (res: Response) => {
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Origin', '*')
}

export const generateCorsMiddleware = (
  patterns: { wildcard: string; methods: Array<'POST' | 'GET'> }[]
): Handler => {
  const compiled = patterns.map((p) => {
    return {
      test: wcmatch(p.wildcard),
      methods: p.methods,
    }
  })

  return (req, res, next) => {
    if (
      compiled.some(
        (c) => c.test(req.path) && c.methods.includes(req.method as any)
      )
    ) {
      res.header('Access-Control-Allow-Headers', '*')
      res.header('Access-Control-Allow-Origin', '*')

      if (req.method === 'OPTIONS') {
        res.status(200).send()
        return
      }
    }

    next()
  }
}
