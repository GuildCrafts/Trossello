import React, { Component } from 'react'
import $ from 'jquery'
import DialogBox from '../../DialogBox'
import Link from '../../Link'
import Avatar from '../../Avatar'

export default class CardMembersMenu extends Component {

  static PropTypes = {
    card: React.PropTypes.object.isRequired,
    board: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      boardUsers: this.props.board.users,
      cardId: this.props.card.id,
    }
    // this.addCardUser = this.addCardUser.bind(this)
    // this.removeCardUser = this.removeCardUser.bind(this)
  }

  componentDidMount() {
    this.refs.searchMembers.focus()
  }

  addCardUser(userId, event) {
    const { card, board } = this.props
    const boardId = board.id
    $.ajax({
      method: 'POST',
      url: `/api/cards/${card.id}/users/add`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({boardId, targetId: userId})
    }).then( () => {
      boardStore.reload()
    })

  }

  removeCardUser(userId, event) {
    const { card, board } = this.props
    const boardId = board.id
    $.ajax({
      method: 'POST',
      url: `/api/cards/${card.id}/users/remove`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({boardId, targetId: userId})
    }).then( () => {
      boardStore.reload()
    })
  }

  render() {
    const { card, board } = this.props
    const boardUserImages = board.users.map( user => {
      if(card.user_ids.includes(user.id)) {
       return <UserAvatar user={user}
          onClick={this.removeCardUser.bind(this, user.id)}
          key={user.id}
        />
      } else {
        return <UserAvatar user={user}
          onClick={this.addCardUser.bind(this, user.id)}
          key={user.id}
        />
      }
    }
    )
    return <DialogBox onClose={this.props.onClose}
      heading={'Members'}
      className='CardModal-CardMembersMenu'
    >
      <div className='CardModal-CardMembersMenu-membersWrapper'>
        <input ref='searchMembers'
          name='searchMembers'
          placeholder='Search Member'
        />
        <div className='CardModal-CardMembersMenu-boardUsersHeader'>
          Board Members
        </div>
        <div className='CardModal-CardMembersMenu-boardUsers'>
          {boardUserImages}
        </div>        
      </div>
    </DialogBox>
  }
}

const UserAvatar = (props) => {
  const { user, onClick } = props
  return <Link onClick={onClick}>
    <Avatar src={user.avatar_url}
      className='CardModal-CardMembersMenu-UserAvatar'
    />
  </Link>
}
