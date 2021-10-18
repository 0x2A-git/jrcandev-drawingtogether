import Cookies from 'js-cookie'
import react, { useContext } from 'react'
import UserContext from '../contexts/UserContext'
import withRedirect from './withRedirect'

const withAuth = (Component: React.FC, failureRedirectLocation = '/') => {
  return (props) => {

    if(Cookies.get('jwt') === undefined)
      return withRedirect(Component, failureRedirectLocation)(props)
    return <Component {...props}/>

  }
}

export default withAuth
