import { Button, IconButton } from '@chakra-ui/button'
import { FormControl, FormHelperText, FormLabel } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { VStack } from '@chakra-ui/layout'
import React, { useContext, useState } from 'react'
import { MdHelpOutline } from 'react-icons/md'
import { BasicInput } from '../../interfaces/BasicInput'
import validator from 'validator'
import Cookies from 'js-cookie'
import { useRouter } from 'next/dist/client/router'
import UserContext from '../../contexts/UserContext'
import { Checkbox } from '@chakra-ui/checkbox'

export default function SignIn() {
  const [email, setEmail] = useState<BasicInput>({
    shouldWarn: false,
    isValid: false,
    value: '',
  })

  const [password, setPassword] = useState<BasicInput>({
    shouldWarn: false,
    isValid: false,
    value: '',
  })

  const [rememberMe, setRememberMe] = useState(false)
  const [processing, setProcess] = useState(false)

  const router = useRouter()

  const user = useContext(UserContext)

  async function handleOnSignIn(event: React.SyntheticEvent) {
    event.preventDefault()

    setProcess(true)

    const credentials = {
      email: email.value,
      password: password.value,
    }

    const request = await fetch(`http://${process.env.DOMAIN}:${process.env.PORT}/api/users/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const responseJSON = await request.json()

    // Errors handling
    if (responseJSON.jwt !== undefined) {
      user?.setJWT(responseJSON.jwt, rememberMe)
      router.replace('/dashboard')
      return
    }

    setProcess(false)
  }

  return (
    <form>
      <VStack spacing={8}>
        {/* Email */}
        <FormControl>
          <FormLabel>Email</FormLabel>

          <Input
            isRequired
            isInvalid={!email.isValid && email.shouldWarn}
            placeholder="john.doe@example.com"
            name="email"
            type="text"
            onChange={(event) =>
              setEmail(
                (_): BasicInput => ({
                  shouldWarn: true,
                  isValid: validator.isEmail(event.target.value),
                  value: event.target.value,
                })
              )
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>

          <Input
            isRequired
            isInvalid={!password.isValid && password.shouldWarn}
            minLength={8}
            maxLength={24}
            placeholder="Password"
            name="password"
            type="password"
            onChange={(event) =>
              setPassword(
                (_): BasicInput => ({
                  shouldWarn: true,
                  isValid:
                    validator.isLength(event.target.value, {
                      min: 8,
                      max: 24,
                    }) && validator.isStrongPassword(event.target.value),
                  value: event.target.value,
                })
              )
            }
          />
        </FormControl>
        <Checkbox iconColor="blue.400" iconSize="1rem" onChange={e => setRememberMe(e.target.checked)} width="100%">
          Remember me
        </Checkbox>
        <Button
          isLoading={processing}
          type="submit"
          colorScheme="green"
          w="full"
          onClick={handleOnSignIn}
        >
          Sign In
        </Button>
      </VStack>
    </form>
  )
}
