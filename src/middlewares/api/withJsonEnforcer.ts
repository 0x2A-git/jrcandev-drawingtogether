import { NextApiRequest, NextApiResponse } from 'next'

const withJsonEnforcer = (handler: Function) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Check content type and check if it's an object
    if (
      req.headers['content-type'] === 'application/json' ||
      (typeof req.body === 'object' &&
        !Array.isArray(req.body) &&
        req.body !== null)
    )
      return handler(req, res)

    return res.status(400).send('Bad Request')
  }
}

export default withJsonEnforcer
