import React, { Component } from 'react'
import ColorBoxGroup from '../../../ColorBoxGroup'
import commands from '../../../../commands'

export default class ChangeBackground extends Component {
  static PropTypes = {
    board: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props)
    this.updateColor = this.updateColor.bind(this)
  }

  updateColor(event){
    const { board } = this.props
    if (event.target.attributes.color.value != board.background_color) {
      commands.updateBoardColor(board.id, event.target.attributes.color.value)
    }
  }

  render () {
    return <div className="BoardShowPage-MenuSideBar-ChangeBackgroundPane-container">
      <ColorBoxGroup
        onClick={this.updateColor}
        board={this.props.board}
      />
    </div>
  }
}
