import React, { Component } from 'react'
import $ from 'jquery'
import DialogBox from '../../DialogBox'
import Link from '../../Link'
import Avatar from '../../Avatar'
import Icon from '../../Icon'

export default class CardMembersMenu extends Component {

  static PropTypes = {
    board: React.PropTypes.object.isRequired,
    card: React.PropTypes.object.isRequired,
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
      const isMember = card.user_ids.includes(user.id)
      const onClick = isMember ?
        this.removeCardUser.bind(this, user.id) :
        this.addCardUser.bind(this, user.id)
      return <UserAvatar
        key={user.id}
        user={user}
        onClick={onClick}
        isMember={isMember}
      />
    })
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
  const { user, onClick, isMember } = props
  const checkmark = isMember ?
    <Icon type="check-square" className="CardModal-CardMembersMenu-checkmark" />
  :
    null
  return <Link onClick={onClick} className='CardModal-CardMembersMenu-UserAvatar'>
    <Avatar src={user.avatar_url} />
    {checkmark}
  </Link>
}
