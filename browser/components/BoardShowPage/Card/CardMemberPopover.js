import React, { Component } from 'react'
import $ from 'jquery'
import Avatar from '../../Avatar'
import DialogBox from '../../DialogBox'
import Link from '../../Link'

export default class CardMemberPopover extends Component {

  static PropTypes = {
    board: React.PropTypes.object.isRequired,
    card: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    onClose: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
  }

  removeUserFromCard(userId, event) {
    event.preventDefault()
    const { card, board } = this.props
    const boardId = board.id
    $.ajax({
      method: 'post',
      url: `/api/cards/${card.id}/users/remove`,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify({boardId, targetId: userId})
    }).then( () => {
      boardStore.reload()
    })
  }

  render() {
    const { board, card, onClose, user } = this.props
    return <div onClose={onClose} className='CardModal-CardMemberPopover' >
      <div className="CardModal-CardMemberPopover-User">
        <Avatar size="large" src={user.avatar_url} />
        <div className="CardModal-CardMemberPopover-User-details">
          {user.name}
        </div>
      </div>
      <div className="CardModal-CardMemberPopover-controls">
        <Link onClick={this.removeUserFromCard.bind(this, user.id)}
          className='CardModal-CardMemberPopover-removeLink'
        >
          Remove from Card
        </Link>
      </div>
    </div>
  }

}
