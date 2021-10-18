import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { useState } from 'react'
import Cookies from 'js-cookie'
import UserContext from '../contexts/UserContext'
import JwtDecode from 'jwt-decode'

function DrawingTogetherApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState({
    jwt: Cookies.get('jwt'),
    setJWT: (jwt: string, isSessionOnly: boolean = true) => {
      const decoded : any = JwtDecode(jwt)

      Cookies.set(
        'jwt',
        jwt,
        isSessionOnly
          ? {
              expires: new Date(decoded.exp * 1000),
            }
          : undefined
      )
    },
  })

  return (
    <ChakraProvider>
      <UserContext.Provider value={user}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </ChakraProvider>
  )
}
export default DrawingTogetherApp
