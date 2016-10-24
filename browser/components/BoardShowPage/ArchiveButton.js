import React, { Component } from 'react'
import Link from '../Link'
import Icon from '../Icon'
import ConfirmationLink from '../ConfirmationLink'

const ArchiveButton = (props) => {
  const className = `BoardShowPage-ArchiveButton ${props.className||''}`
  return <ConfirmationLink
    onConfirm={props.onClick}
    message={props.confirmationMessage}
    className={className}
  >
    <Icon type='archive'/>
  </ConfirmationLink>
}

export default ArchiveButton
