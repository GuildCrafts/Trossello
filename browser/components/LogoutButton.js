import React, { Component } from 'react'

const logout = (event) => {
  event.preventDefault();
  // actions.logout()
  // HACK FOR NOW
  $.post('/logout', () => {
    location.reload()
  })
}

const LogoutButton = (props) => {
  return <button {...props} onClick={logout}>{props.children}</button>
}

export default LogoutButton
