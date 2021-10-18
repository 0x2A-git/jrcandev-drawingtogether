import { Button, IconButton } from '@chakra-ui/button'
import { Editable, EditableInput, EditablePreview } from '@chakra-ui/editable'
import { FormControl, FormHelperText, FormLabel } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Center, Grid, GridItem, VStack } from '@chakra-ui/layout'
import React, { useContext, useState } from 'react'
import useSWR from 'swr'
import validator from 'validator'
import { BasicInput } from '../../interfaces/BasicInput'
import Cookies from 'js-cookie'
import { useRouter } from 'next/dist/client/router'
import { MdHelpOutline } from 'react-icons/md'
import UserContext from '../../contexts/UserContext'

export default function SignUp() {
  const [username, setUsername] = useState<BasicInput>({
    shouldWarn: false,
    isValid: false,
    value: '',
  })

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

  const [confirmPassword, setConfirmPassword] = useState<BasicInput>({
    shouldWarn: false,
    isValid: false,
    value: '',
  })

  const [processing, setProcess] = useState(false)

  const router = useRouter()

  const user = useContext(UserContext)

  async function handleOnSignUp(event: React.SyntheticEvent) {
    event.preventDefault()

    setProcess(true)

    const credentials = {
      username: username.value,
      email: email.value,
      password: password.value,
    }

    const request = await fetch(`http://${process.env.DOMAIN}:${process.env.PORT}/api/users/new`, {
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
      user?.setJWT(responseJSON.jwt)
      router.replace('/dashboard')
    }

    setProcess(false)
  }

  return (
    <form onSubmit={handleOnSignUp}>
      <VStack spacing={8}>
        {/* Username */}
        <FormControl isRequired>
          <FormLabel>
            Username{' '}
            <IconButton
              isRound
              aria-label="Username Tip"
              icon={<MdHelpOutline />}
            ></IconButton>
          </FormLabel>

          <Input
            isRequired
            isInvalid={!username.isValid && username.shouldWarn}
            placeholder="JohnDoe"
            name="username"
            type="text"
            onChange={(event) =>
              setUsername(
                (username): BasicInput => ({
                  shouldWarn: true,
                  isValid:
                    validator.isAlphanumeric(event.target.value) &&
                    validator.isLength(event.target.value, {
                      min: 3,
                      max: 20,
                    }),
                  value: event.target.value,
                })
              )
            }
          />
          <FormHelperText>
            Alphanumerics (A-Z, 0-9) <br /> Length : 3 - 20
          </FormHelperText>
        </FormControl>

        {/* Email */}
        <FormControl isRequired>
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

        {/* Password */}
        <FormControl isRequired>
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

          <FormHelperText>
            Alphanumerics (A-Z, 0-9) <br />
            At least one special character <br />
            At least on uppercase letter <br />
            At least one lowercase letter <br />
            At least one number <br />
            Length : 8 - 24
          </FormHelperText>
        </FormControl>

        {/* Confirm Password */}
        <FormControl isRequired>
          <FormLabel>Confirm Password</FormLabel>

          <Input
            isRequired
            isInvalid={!confirmPassword.isValid && confirmPassword.shouldWarn}
            minLength={8}
            maxLength={24}
            placeholder="Password"
            type="password"
            onChange={(event) =>
              setConfirmPassword(
                (_): BasicInput => ({
                  shouldWarn: true,
                  isValid: event.target.value === password.value,
                  value: event.target.value,
                })
              )
            }
          />
        </FormControl>

        <Button
          isLoading={processing}
          type="submit"
          colorScheme="blue"
          w="full"
        >
          Sign Up
        </Button>
      </VStack>
    </form>
  )
}
