import React, { Component } from 'react'
import Avatar from '../../Avatar'
import Link from '../../Link'
import commands from '../../../commands'

export default class CardMemberPopover extends Component {

  static PropTypes = {
    board: React.PropTypes.object.isRequired,
    card: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    onClose: React.PropTypes.func.isRequired,
  }

  constructor(props){
    super(props)
    this.removeUserFromCard = this.removeUserFromCard.bind(this)
  }

  removeUserFromCard(event) {
    event.preventDefault()
    const { userId, card, board } = this.props
    commands.removeUserFromCard(userId, card.id, board.id)
  }

  render() {
    const { board, card, onClose, user } = this.props
    return <div className="CardModal-CardMemberPopover">
      <div className="CardModal-CardMemberPopover-User">
        <Avatar size="large" src={user.avatar_url} />
        <div className="CardModal-CardMemberPopover-User-details">
          {user.name}
        </div>
        <Link onClick={onClose}>&nbsp;X</Link>
      </div>
      <div className="CardModal-CardMemberPopover-controls">
        <Link onClick={this.removeUserFromCard}
          className="CardModal-CardMemberPopover-removeLink"
        >
          Remove from Card
        </Link>
      </div>
    </div>
  }

}
