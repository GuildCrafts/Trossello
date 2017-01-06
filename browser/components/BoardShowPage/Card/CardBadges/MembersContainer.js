import React from 'react'
import BadgeContainer from './BadgeContainer'
import PopoverMenuButton from '../../../PopoverMenuButton'
import CardMember from './CardMember'

const MembersContainer = ({card, board}) => {
  const cardMembers = board.users
    .filter(user => card.user_ids.includes(user.id) )
    .map( user =>
      <CardMember
        key={user.id}
        className='CardModal-MemberAvatar'
        board={board}
        card={card}
        user={user}
      />
    )

  return <BadgeContainer heading="Members">
    {cardMembers}
  </BadgeContainer>
}

export default MembersContainer
