import React, { Component } from 'react'
import Link from '../Link'
import Icon from '../Icon'
import ConfirmationLink from '../ConfirmationLink'

const ArchiveButton = (props) => {
  const className = `BoardShowPage-ArchiveButton ${props.className||''}`
  return <ConfirmationLink
    onConfirm={props.onClick}
    name={props.name}
    title={props.confirmationTitle}
    message={props.confirmationMessage}
    className={className}
  >
    <Icon size={props.size} type='archive'/>
  </ConfirmationLink>
}

export default ArchiveButton
