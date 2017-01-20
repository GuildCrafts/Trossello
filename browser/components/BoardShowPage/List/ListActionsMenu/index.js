import React, { Component } from 'react'
import ActionsMenu from '../../ActionsMenu'
import './index.sass'

// panes
import ArchiveAllCardsPane from './panes/ArchiveAllCardsPane.js'
import CopyListPane from './panes/CopyListPane.js'
import ListActionsPane from './panes/ListActionsPane.js'
import MoveAllCardsPane from './panes/MoveAllCardsPane.js'
import MoveListPane from './panes/MoveListPane.js'

export default class ListActionsMenu extends Component {
  static propTypes = {
    board: React.PropTypes.object.isRequired,
    list: React.PropTypes.object.isRequired,
    // onClose: React.PropTypes.func.isRequired,
  }

  constructor(props){
    super(props)
    this.createCard = this.createCard.bind(this)
  }

  createCard(event){
    this.props.onCreateCard()
    this.props.onClose()
  }

  render(){
    const { board, list, onClose } = this.props
    return <ActionsMenu
      className="BoardShowPage-List-ListActionsMenu"
      defaultPane="List Actions"
      paneProps={{
        board,
        list,
        onClose,
        createCard: this.createCard,
      }}
      panes={{
        "List Actions": ListActionsPane,
        "Copy List": CopyListPane,
        "Move List": MoveListPane,
        "Move All Cards": MoveAllCardsPane,
        "Archive All Cards": ArchiveAllCardsPane,
      }}
    />
  }
}
