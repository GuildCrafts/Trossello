import React, { Component } from 'react'
import Card from '../../../../Card'
import Link from '../../../../Link'
import ConfirmationLink from '../../../../ConfirmationLink'
import commands from '../../../../../commands'

export default class ArchivedCards extends Component {

  static PropTypes = {
    searchTerm: React.PropTypes.string.isRequired,
    board: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props)
    this.unarchiveCard = this.unarchiveCard.bind(this)
    this.deleteCard = this.deleteCard.bind(this)
  }

  unarchiveCard(id){
    commands.unarchiveCard(id)
  }

  deleteCard(id){
    commands.deleteCard(id)
  }

  render(){
    const { board } = this.props
    const cards = board.cards
      .filter(card => card.archived)
      .filter(card => `${card.description} ${card.content}`.toUpperCase().indexOf(this.props.searchTerm.toUpperCase()) >= 0)
      .sort((a, b) => a.order - b.order)

    const cardNodes = cards.map((card, index) =>
      <div key={card.id}>
        <Card
          board={board}
          key={card.id}
          card={card}
          index={index}
        />
        <Link onClick={()=> this.unarchiveCard(card.id)} className="BoardShowPage-MenuSideBar-ArchivedItems-UnarchiveButton">Send to Board</Link>-
        <ConfirmationLink
          onConfirm={()=> this.deleteCard(card.id)}
          buttonName="Delete"
          className="BoardShowPage-MenuSideBar-ArchivedItems-UnarchiveButton"
          title='Delete Card?'
          message='All actions will be removed from the activity feed and you won’t be able to re-open the card. There is no undo.'
        >Delete</ConfirmationLink>
      </div>
    )

    return(<div className="BoarddShowPage-MenuSideBar-ArchivedItems-archivedCards">
      {cardNodes}
    </div>
    )
  }
}
