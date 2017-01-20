import React, { Component } from 'react'
import Link from '../Link'
import TimeFromNow from '../TimeFromNow'
import './Activity.sass'

const activityString = (activity, board, users, cardActivity=false) => {

  const openCardModal = `/boards/${activity.board_id}/cards/${activity.card_id}`
  const metadata = JSON.parse(activity.metadata)
  const stringClass = "BoardShowPage-Activity-string"
  const cardNameLink = "BoardShowPage-Activity-string-cardNameLink"
  const timeClass = "BoardShowPage-Activity-time"

  const cardName = () => {
    const card = board.cards.find(card => card.id === activity.card_id)

    return cardActivity ?
      <span> this card </span>
    :
      <span>
        <span> card </span>
        <Link href={openCardModal} className={cardNameLink}>
          <span> {(card.content || '').slice(0, 25)} </span>
        </Link>
      </span>
  }

  const userName = (id) => {
    return <span>{users.find(user => user.id === id).name}</span>
  }

  switch (activity.type) {
    case 'JoinedBoard':
      return <span className={stringClass}>
        joined this board
        <span className={timeClass}>
          <TimeFromNow time={activity.created_at}/>
        </span>
      </span>
    case 'InvitedToBoard':
      return <span className={stringClass}>
        invited {metadata.invited_email} to this board
        <span className={timeClass}>
          <TimeFromNow time={activity.created_at}/>
        </span>
      </span>
    case 'UpdatedBoard':
      if (metadata.attribute_updated === 'name') {
        return <span className={stringClass}>
          changed board name to {metadata.new_board_name} from {metadata.prev_board_name}
          <span className={timeClass}>
            <TimeFromNow time={activity.created_at}/>
          </span>
        </span>
      } else if (metadata.attribute_updated === 'background_color') {
        return <span className={stringClass}>
          changed background color
          <span className={timeClass}>
            <TimeFromNow time={activity.created_at}/>
          </span>
        </span>
      }
    case 'AddedCard':
      return <span className={stringClass}>added
        {cardName()}
        <Link href={openCardModal}
          className={timeClass}
        >
          <TimeFromNow time={activity.created_at}/>
        </Link>
      </span>
    case 'MovedCard':
      const prev_list = board.lists.find(list => list.id === metadata.prev_list_id)
      const new_list = board.lists.find(list => list.id === metadata.new_list_id)
      return <span className={stringClass}>moved
        {cardName()}
        from list {prev_list.name} to list {new_list.name}
        <Link href={openCardModal}
          className={timeClass}
        >
          <TimeFromNow time={activity.created_at}/>
        </Link>
      </span>
    case 'ArchivedCard':
      return <span className={stringClass}>archived
        {cardName()}
        <Link href={openCardModal}
          className={timeClass}
        >
          <TimeFromNow time={activity.created_at}/>
        </Link>
      </span>
    case 'UnarchivedCard':
      return <span className={stringClass}>unarchived
          {cardName()}
        <Link href={openCardModal}
          className={timeClass}
        >
          <TimeFromNow time={activity.created_at}/>
        </Link>
      </span>
    case 'AddedUserToCard':
      return <span className={stringClass}>
        added {userName(metadata.added_card_user)} to {cardName()}
        <Link href={openCardModal}
          className={timeClass}
        >
          <TimeFromNow time={activity.created_at}/>
        </Link>
      </span>
    case 'RemovedUserFromCard':
      return <span className={stringClass}>
        removed {userName(metadata.removed_card_user)} from {cardName()}
        <Link href={openCardModal}
          className={timeClass}
        >
          <TimeFromNow time={activity.created_at}/>
        </Link>
      </span>
    case 'AddedList':
      return <span className={stringClass}>
        added list {metadata.list_name}
        <span className={timeClass}>
          <TimeFromNow time={activity.created_at}/>
        </span>
      </span>
    case 'CreatedBoard':
      return <span className={stringClass}>
        created board {board.name}
        <span className={timeClass}>
          <TimeFromNow time={activity.created_at}/>
        </span>
      </span>
    case 'ArchivedList':
      return <span className={stringClass}>
        archived list {metadata.list_name}
        <span className={timeClass}>
          <TimeFromNow time={activity.created_at}/>
        </span>
      </span>
    case 'UnarchivedList':
      return <span className={stringClass}>
        unarchived list {metadata.list_name}
        <span className={timeClass}>
          <TimeFromNow time={activity.created_at}/>
        </span>
      </span>
    case 'DeletedCard':
      return <span className={stringClass}>
        deleted card #{activity.card_id}
        <span className={timeClass}>
          <TimeFromNow time={activity.created_at}/>
        </span>
      </span>
    default:
      return null
  }
}

const Activity = props => {
  const { activity, users, board, cardActivity } = props
  const user = users.find(user => user.id === activity.user_id)
  const className = `BoardShowPage-Activity ${props.className||''}`

  return <div className={className}>
    <div className="BoardShowPage-Activity-content">
      <img
        className='BoardShowPage-Activity-avatar'
        src={user.avatar_url}
      />
      <span className='BoardShowPage-Activity-username'>
        {user.name}
      </span>
      {activityString(activity, board, users, cardActivity)}
    </div>
    <div className='BoardShowPage-Activity-border' />
  </div>
}

export default Activity
