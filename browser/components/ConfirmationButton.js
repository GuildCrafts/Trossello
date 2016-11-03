import React, { Component } from 'react'
import Button from './Button'
import ConfirmationClickable from './ConfirmationClickable'

const ConfirmationButton = (props) => {
  const clickable = <Button
    type={props.type}
    className={props.className}
    href={props.href}
    submit={props.submit}
  >
    {props.children}
  </Button>
  return <ConfirmationClickable
    clickable={clickable}
    buttonName={props.buttonName}
    title={props.title}
    message={props.message}
    onConfirm={props.onConfirm}
    onAbort={props.onAbort}
  />
}

export default ConfirmationButton
