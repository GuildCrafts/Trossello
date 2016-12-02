import React, { Component } from 'react'
import boardStore from '../../../stores/boardStore'
import boardsStore from '../../../stores/boardsStore'
import ColorBox from '../ColorBox'
import $ from 'jquery'

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
      $.ajax({
        method: 'post',
        url: `/api/boards/${board.id}`,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({background_color: event.target.attributes.color.value}),
      }).then(() => {
        boardStore.reload()
        boardsStore.reload()
      })
    }
  }

  render () {
    const colorBoxes = colors.map(color =>
      <ColorBox key={color}
        color={color}
        onClick={this.updateColor}
        className="BoardShowPage-MenuSideBar-ChangeBackgroundPane-box"
      />
    )

    return <div className="BoardShowPage-MenuSideBar-ChangeBackgroundPane-container">
      {colorBoxes}
    </div>
  }
}

const colors = [
  "#0079bf",
  "#d8a359",
  "#70a95d",
  "#bc6858",
  "#9d7cae",
  "#d478a4",
  "#6cc885",
  "#30bbd3",
  "#98a0a4"
]
