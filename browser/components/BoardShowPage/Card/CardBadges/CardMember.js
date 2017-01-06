import React, { Component } from 'react'
import Avatar from '../../../Avatar'
import Link from '../../../Link'
import CardMemberPopover from './CardMemberPopover'
import ToggleComponent from '../../../ToggleComponent'

export default class CardMember extends ToggleComponent {

  static PropTypes = {
    board: React.PropTypes.object.isRequired,
    card: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
  }

  render() {
    const { board, card, user } = this.props
    const cardUserPopover = this.state.open
      ? <CardMemberPopover card={card} board={board}
        user={user} onClose={this.close} />
      : null

    return <span className="CardMember">
      <Link onClick={this.toggle}>
        <Avatar src={user.avatar_url} />
      </Link>
      {cardUserPopover}
    </span>
  }
}
