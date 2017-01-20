import React from 'react'
import LabelSection from './LabelSection'
import MemberLabel from './MemberLabel'
import PopoverMenuButton from '../../PopoverMenuButton'

const MembersContainer = ({card, board}) => {
  const cardMembers = board.users
    .filter(user => card.user_ids.includes(user.id) )
    .map( user =>
      <MemberLabel
        key={user.id}
        className='Card-MemberAvatar'
        board={board}
        card={card}
        user={user}
      />
    )

  return <LabelSection heading="Members">
    {cardMembers}
  </LabelSection>
}

export default MembersContainer
