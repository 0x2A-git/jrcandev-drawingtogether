import { NextApiRequest, NextApiResponse } from 'next'
import validator from 'validator'
import prisma from '../../../lib/prisma'

interface Data {
  name?: string
}
// TODO : Check if number too large
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | string>
) {
  const id = req.query['id'] as string
  if (!Number.isSafeInteger(parseInt(id)) || !validator.isNumeric(id)) return res.status(400).send('Bad request')

  const user = await prisma.user.findFirst({
    select: {
      name: true,
    },
    where: {
      id: parseInt(id),
    },
  })

  if(!user) return res.status(404).send('Not found')

  return res.status(200).json({
    name: user.name
  })
}

export default handler
