import React, { Component } from 'react'
import Button from '../../../../Button'
import ActionsMenuPane from '../../../ActionsMenuPane'
import commands from '../../../../../commands'

export default class ArchiveAllCardsPane extends Component {

  constructor(props){
    super(props)
    this.archiveCardsInList = this.archiveCardsInList.bind(this)
  }

  archiveCardsInList(){
    commands.archiveCardsInList(this.props.list.id)
  }

  render(){
    return <ActionsMenuPane
      className="BoardShowPage-List-ListActionsMenu-ArchiveAllCardsPane"
      heading="Archive All Cards in this List?"
      onClose={this.props.onClose}
      onBack={this.props.goToPane('List Actions')}
    >
      <div className="BoardShowPage-List-ListActionsMenu-DialogBox-content">
        <p>
          This will remove all the cards in this list from the board. To view archived
          cards and bring them back to the board, click “Menu” > “Archived Items.”
        </p>
        <Button type="danger" onClick={this.archiveCardsInList}>Archive All</Button>
      </div>
    </ActionsMenuPane>
  }
}
