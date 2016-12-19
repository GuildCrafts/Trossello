import React, { Component } from 'react'
import $ from 'jquery'
import ConfirmationButton from './ConfirmationButton'

const logout = () => {
  // actions.logout()
  // still kind of hacky, but functional
  $.post('/logout', () => {
    location.assign('/')
  })
}

const LogoutButton = (props) => {
  const className = `LogoutButton ${props.className}`
  return <ConfirmationButton
    {...props}
    type="invisible"
    buttonName="Log Out"
    title="Log Out?"
    message="Are you sure you want to log out?"
    onConfirm={logout}
    className={className}>
    {props.children}
  </ConfirmationButton>
}

export default LogoutButton
