import React, { Component } from 'react'
import Link from './Link'
import ConfirmationClickable from './ConfirmationClickable'

const ConfirmationLink = (props) => {
  const clickable = <Link
    className={props.className}
    href={props.href}
  >
    {props.children}
  </Link>
  return <ConfirmationClickable
    clickable={clickable}
    buttonName={props.buttonName}
    title={props.title}
    message={props.message}
    onConfirm={props.onConfirm}
    onAbort={props.onAbort}
  />
}

export default ConfirmationLink
