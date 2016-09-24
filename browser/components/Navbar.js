import React from 'react'
import PresentationalComponent from './PresentationalComponent'
import LogoutButton from './LogoutButton'
import LoginButton from './LoginButton'

const Navbar = (props) => {
  const { state } = props
  const button = state.auth.isAuthenticated ?
    <LogoutButton>Logout</LogoutButton> :
    <LoginButton>Login</LoginButton>
  ;
  return <div className="Navbar">
    {button}
  </div>
}


export default PresentationalComponent(Navbar)
