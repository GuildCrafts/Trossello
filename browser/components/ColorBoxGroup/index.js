import React, { Component } from 'react'
import ColorBox from './ColorBox'
import './index.sass'

export default class ColorBoxGroup extends Component {
  static propTypes = {
    onClick: React.PropTypes.func.isRequired,
    board: React.PropTypes.object,
    onClose: React.PropTypes.func,
    currentColor: React.PropTypes.string,
  }

  render(){
    const colorBoxes = colors.map(color => {
      const checked = (this.props.currentColor === color)
      const boardId = this.props.board
      ? this.props.board.id
      : null

      return <div
        key={color}
        className="BoardShowPage-CardModal-LabelMenu-CreateLabelPanel-colorbox">
        <ColorBox
          checked={checked}
          color={color}
          boardId={boardId}
          onClick={this.props.onClick}
          onClose={this.props.onClose}
        />
      </div>
    })

    const className = this.props.className
      ? `ColorBoxGroup`
      : `ColorBoxGroup ${this.props.className}`

    return <div className={className}>
      {colorBoxes}
    </div>
  }
}

const colors = [
  'blue',
  'orange',
  'green',
  'red',
  'purple',
  'pink',
  'mint',
  'sky',
  'grey'
]
