import React, { Component } from 'react'
import ContainerComponent from './ContainerComponent'

const LoginForm = ({actions}) => {
  const onSubmit = (event) => {
    event.preventDefault()
    actions.login({})
  }
  return <form onSubmit={onSubmit}>
    <label>
      <span>email</span>
      <input type="text" />
    </label>
    <label>
      <span>password</span>
      <input type="password" />
    </label>
    <input type="submit" />
  </form>
}

export default ContainerComponent(LoginForm)
