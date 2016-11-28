import React, { Component } from 'react'
import moment from 'moment'
import './ActivityPanel.sass'

export default class ActivityPanel extends Component {

  static PropTypes = {
    board: React.PropTypes.object.isRequired
  }

  render() {
    const activities = this.props.board.activity.reverse().map(activity =>
      <Activity key={activity.id} activity={activity} users={this.props.board.users} board={this.props.board}/>
    )
    return <div className='BoardShowPage-MenuSideBar-Pane'>
      {activities}
    </div>
  }
}

const activityString = (activity, user, board) => {
  let card, list
  const metadata = JSON.parse(activity.metadata)
  switch (activity.type) {
    case 'JoinedBoard':
      return ' joined this board '
      break;
    case 'InvitedToBoard':
      return ` invited ${metadata.invited_email} to this board `
      break;
    case 'UpdatedBoard':
      if (metadata.attribute_updated === 'name') {
        return ` changed board name to ${metadata.new_board_name} from ${metadata.prev_board_name} `
      } else if (metadata.attribute_updated === 'background_color') {
        return ' changed background color '
      }
      break;
    case 'AddedCard':
      return ` added card ${metadata.content} `
      break;
    case 'MovedCard':
      card = board.cards.find(card => card.id === activity.card_id)
      const prev_list = board.lists.find(list => list.id === metadata.prev_list_id)
      const new_list = board.lists.find(list => list.id === metadata.new_list_id)
      return ` moved card ${card.content} from list ${prev_list.name} to list ${new_list.name} `
      break;
    case 'ArchivedCard':
      card = board.cards.find(card => card.id === activity.card_id)
      return ` archived card ${card.content} `
      break;
    case 'UnarchivedCard':
      card = board.cards.find(card => card.id === activity.card_id)
      return ` unarchived card ${card.content} `
      break;
    case 'AddedList':
      list = board.lists.find(list => list.id === metadata.list_id)
      return ` added list ${list.name} `
      break;
    case 'CreatedBoard':
      return ` created board ${board.name} `
      break;
    case 'ArchivedList':
      list = board.lists.find(list => list.id === metadata.list_id)
      return ` archived list ${list.name} `
    break;
    case 'UnarchivedList':
      list = board.lists.find(list => list.id === metadata.list_id)
      return ` unarchived list ${list.name} `
    break;
    default:
      return ''
  }
}

const Activity = props => {
  const { activity, users, board } = props
  const user = users.find(user => user.id === activity.user_id)

  return <div className='ActivityPanel-Activity'>
    <img src={user.avatar_url}/>
    <div className='ActivityPanel-Activity-content'>
      <span className='ActivityPanel-Activity-username'>
        {user.name}
      </span>
      {activityString(activity, user, board)}
      <span className='ActivityPanel-Activity-time'>
        {moment(activity.created_at).fromNow()}
      </span>
    </div>
  </div>
}
