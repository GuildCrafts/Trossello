import React, { Component } from 'react'
import $ from 'jquery'
import ConfirmationLink from './ConfirmationLink'

const logout = () => {
  // actions.logout()
  // still kind of hacky, but functional
  $.post('/logout', () => {
    location.assign('/')
  })
}

const LogoutButton = (props) => {
  return <ConfirmationLink
    {...props}
    message="Log out?"
    onConfirm={logout}>
    {props.children}
  </ConfirmationLink>
}

export default LogoutButton
