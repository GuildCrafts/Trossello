import React, { Component } from 'react'
import Link from '../Link'
import Icon from '../Icon'

const ArchiveButton = (props) => {
  const className = `BoardShowPage-ArchiveButton ${props.className||''}`
  return <Link className={className} onClick={props.onClick}>
    <Icon type="archive" />
  </Link>
}

export default ArchiveButton
