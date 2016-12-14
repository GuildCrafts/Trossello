import React, { Component } from 'react'
import ConfirmationButton from './ConfirmationButton'
import commands from '../commands'

const LogoutButton = (props) => {
  const className = `LogoutButton ${props.className}`
  return <ConfirmationButton
    {...props}
    type="invisible"
    buttonName="Log Out"
    title="Log Out?"
    message="Are you sure you want to log out?"
    onConfirm={commands.logout}
    className={className}
  >
    {props.children}
  </ConfirmationButton>
}

export default LogoutButton
