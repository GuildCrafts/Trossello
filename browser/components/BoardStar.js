import React, {Component} from 'react'
import Button from './Button'
import Icon from './Icon'
import commands from '../commands'
import './BoardStar.sass'

export default class BoardStar extends Component {
  static propTypes = {
    board: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func,
  }

  constructor(props){
    super(props)
    this.toggleStar = this.toggleStar.bind(this)
  }

  toggleStar(event) {
    event.stopPropagation()
    event.preventDefault()
    const { board, onChange } = this.props
    commands.toggleStar(board.id, board.starred).then(onChange)
  }

  render(){
    const { board } = this.props
    const className = this.props.className
    ? `BoardStar ${this.props.className}`
    : `BoardStar BoardStar-${board.starred ? 'active' : 'inactive'}`

    return <Button
      className={className}
      type="unstyled"
      title="Click to star this board. It will show up at the top of your boards list."
      onClick={this.toggleStar}
    >
      <Icon type="star-o" />
    </Button>
  }
}
