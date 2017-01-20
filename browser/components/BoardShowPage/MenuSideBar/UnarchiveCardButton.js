import React from 'react'
import Link from '../../Link'
import commands from '../../../commands'

const UnarchiveCardButton = (props) => {
  const className = `BoardShowPage-UnarchiveCardButton ${props.className||''}`
  const onClick = (event) => {
    event.preventDefault()
    commands.unarchiveRecord('cards', props.card.id)
  }
  return <Link
    onClick={onClick}
    className={className}>
    Unarchive Card
  </Link>
}

export default UnarchiveCardButton
