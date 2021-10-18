import { NextApiRequest, NextApiResponse } from 'next'
import withJsonEnforcer from '../../../middlewares/api/withJsonEnforcer'
import bcrypt from 'bcrypt'
import prisma from '../../../lib/prisma'
import jsonwebtoken, {Secret} from 'jsonwebtoken'
import validator from 'validator'

interface Data {
  errors?: string
  jwt?: string
}

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const errors: any = []

  if (req.body.email === undefined || !validator.isEmail(req.body.email))
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

  // Find user by email
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      password: true,
    },
    where: {
      email: req.body.email,
    },
  })

  // If user not found
  if (user === null)
    return res.status(400).json({
      errors: JSON.stringify({
        msg: 'Invalid credentials',
      }),
    })

  let isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)

  // Check if password is correct
  if (!isPasswordCorrect)
    return res.status(400).json({
      errors: JSON.stringify({
        msg: 'Invalid credentials',
      }),
    })

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

  return res.status(200).json({
    jwt: accessToken,
  })
}

export default withJsonEnforcer(handler)
