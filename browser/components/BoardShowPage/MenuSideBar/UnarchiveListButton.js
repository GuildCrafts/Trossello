import React from 'react'
import Link from '../../Link'
import commands from '../../../commands'

const UnarchiveListButton = (props) => {
  const className = `BoardShowPage-UnarchiveListButton ${props.className||''}`
  const onClick = (event) => {
    event.preventDefault()
    commands.unarchiveRecord('lists', props.list.id)
  }
  return <Link
    onClick={onClick}
    className={className}>
    Unarchive List
  </Link>
}

export default UnarchiveListButton
