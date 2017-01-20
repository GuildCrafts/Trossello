import React, { Component } from 'react'
import Avatar from '../../Avatar'
import Link from '../../Link'
import commands from '../../../commands'
import './MemberLabelPopover.sass'

export default class MemberLabelPopover extends Component {

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
    const { user, card, board } = this.props
    commands.removeUserFromCard(user.id, card.id, board.id)
  }

  render() {
    const { board, card, onClose, user } = this.props
    return <div className="Card-MemberLabelPopover">
      <div className="Card-MemberLabelPopover-User">
        <Avatar size="large" src={user.avatar_url} />
        <div className="Card-MemberLabelPopover-User-details">
          {user.name}
        </div>
        <Link className="Card-MemberLabelPopover-close" onClick={onClose}>&nbsp;X</Link>
      </div>
      <div className="Card-MemberLabelPopover-controls">
        <Link onClick={this.removeUserFromCard}
          className="Card-MemberLabelPopover-removeLink"
        >
          Remove from Card
        </Link>
      </div>
    </div>
  }

}
