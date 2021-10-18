// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import validator from 'validator'
import prisma from '../../../lib/prisma'
import withJsonEnforcer from '../../../middlewares/api/withJsonEnforcer'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
type Data = {
  errors?: string
  jwt?: string
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '298b',
    },
  },
}

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let errors: any = []

  if (
    req.body.username === undefined ||
    !validator.isAlphanumeric(req.body.username) ||
    !validator.isLength(req.body.username, {
      min: 3,
      max: 20,
    })
  )
    errors.push({
      field: 'username',
      msg: 'Invalid username',
    })

  // Email check

  if (
    req.body.email === undefined ||
    !validator.isEmail(req.body.email))
    errors.push({
      field: 'email',
      msg: 'Invalid email',
    })

  // Password check
  if (
    req.body.password === undefined ||
    !validator.isLength(req.body.password, {
      min: 8,
      max: 24,
    }) ||
    !validator.isStrongPassword(req.body.password)
  )
    errors.push({
      field: 'password',
      msg: 'Invalid password',
    })

  // If errors stop and send 400 status
  if (errors.length > 0)
    return res.status(400).json({
      errors: JSON.stringify(errors),
    })

  // Next check if user already exists
  const userExists = await prisma.user.findFirst({
    where: {
      OR: { email: req.body.email, name: req.body.username },
    },
  })

  // TODO : send whether email already exists, username or both
  if (userExists !== null)
    return res.status(403).json({
      errors: JSON.stringify({
        msg: 'User already exists',
      }),
    })

  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.username,
      password: await bcrypt.hash(req.body.password, 10),
    },
  })

  console.log(user.id)

  // Generate access token
  const accessToken: string = await new Promise<string>((resolve, reject) =>
    jsonwebtoken.sign(
      {
        uid: user.id,
        iat: Math.floor(Date.now() / 1000) - 30,
      },
      process.env.JWT_SECRET!,
      {
        algorithm: 'HS512',
        expiresIn: '1h',
      },
      (err: Error | null, token: string | undefined) => {
        if (err !== null)
          return res
            .status(500)
            .json({ errors: JSON.stringify({ msg: 'Internal Server Error' }) })
        resolve(token!)
      }
    )
  )

  res.status(200).json({
    jwt: accessToken,
  })
}

export default withJsonEnforcer(handler)
