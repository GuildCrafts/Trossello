import React, { Component } from 'react'
import $ from 'jquery'

const logout = (event) => {
  event.preventDefault();
  // actions.logout()
  // still kind of hacky, but functional
  $.post('/logout', () => {
    location.assign('/')
  })
}

const LogoutButton = (props) => {
  return <button {...props} onClick={logout}>{props.children}</button>
}

export default LogoutButton
