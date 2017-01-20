import React from 'react'
import Avatar from '../../Avatar'
import InviteByEmailButton from './InviteByEmailButton'

const BoardMembers = (props) => {
  const { board } = props

  const boardMembers = board => board.users.map( user =>
    <MemberAvatar key={user.id} user={user} />
  )
  const MemberAvatar = (props) => {
    const { user } = props
    return <Avatar src={user.avatar_url} />
  }

  return <div>
    <div className='BoardShowPage-MenuSideBar-BoardMembers'>
      { boardMembers( board ) }
    </div>
    <InviteByEmailButton boardId={board.id}/>
    </div>
}

export default BoardMembers
