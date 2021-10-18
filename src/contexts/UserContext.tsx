import React from "react"

interface UserContext {
  jwt: string | undefined
  setJWT: (jwt : string, isSessionOnly?: boolean) => void
}

const UserContext = React.createContext<UserContext | null>(null)

export default UserContext