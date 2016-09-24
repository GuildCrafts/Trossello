import React, { Component } from 'react'
import { connect } from 'react-redux'
import ContainerComponent from './ContainerComponent'

const LogoutButton = (actions, props) => {
  const logout = (event) => {
    event.preventDefault();
    actions.logout()
  }
  return <button {...props} onClick={logout}>{props.children}</button>
}

export default ContainerComponent(LogoutButton)
