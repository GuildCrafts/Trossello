import React, { Component } from 'react'
import Button from '../../../../Button'
import ActionsMenuPane from '../../../ActionsMenuPane'
import commands from '../../../../../commands'

export default class MoveAllCardsPane extends Component {

  static propTypes = {
    list: React.PropTypes.object.isRequired,
    board: React.PropTypes.object.isRequired,
  }

  moveCards(destinationList){
    const { list: fromList, board } = this.props
    commands.moveCardsToList(fromList.id, destinationList.id)
      .then(this.props.onClose)
  }

  moveCardsTo(list){
    return (event) => {
      event.preventDefault()
      this.moveCards(list)
    }
  }

  render(){
    const { board, onClose } = this.props
    const lists = board.lists
      .filter(list => !list.archived)
      .sort((a,b) => a.order - b.order)
      .map(list =>
        <Button
          type="invisible"
          key={list.id}
          onClick={this.moveCardsTo(list)}
        >{list.name}</Button>
      )

    return <ActionsMenuPane
        className="BoardShowPage-List-ListActionsMenu ListActionsMenu-MoveAllCardsPane"
        heading="Select A List To Move All Cards"
        onClose={onClose}
        onBack={this.props.goToPane('List Actions')}
      >
      <div className="BoardShowPage-List-ListActionsMenu-MoveAllCards">
        {lists}
      </div>
    </ActionsMenuPane>
  }
}
