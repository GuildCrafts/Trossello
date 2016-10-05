import React, { Component } from 'react'
import { connect } from 'react-redux'
import { actions } from '../state'

const logout = (event) => {
  event.preventDefault();
  actions.logout()
}

const LogoutButton = (props) => {
  return <button {...props} onClick={logout}>{props.children}</button>
}

export default LogoutButton
