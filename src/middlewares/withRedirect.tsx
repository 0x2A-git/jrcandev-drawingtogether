import { AppProps } from 'next/app'
import { useRouter } from 'next/dist/client/router'
import React, { useEffect } from 'react'

const withRedirect = (
  Component: React.FC,
  location: string,
  condition: boolean = true
) => {
  const WithRedirectComponent = (props) => {
    const router = useRouter()
    if (condition) {
      useEffect(() => {
        router.replace(location)
      }, [])
      return <p>Loading...</p>
    }

    return <Component {...props} />
  }

  return WithRedirectComponent
}

export default withRedirect
