import React, { Component } from 'react'
import { connect } from 'react-redux'
import { actions } from '../state'

const LogoutButton = (props) => {
  const logout = (event) => {
    event.preventDefault();
    actions.logout()
  }
  return <button {...props} onClick={logout}>{props.children}</button>
}

export default LogoutButton
