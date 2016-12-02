import React, {Component} from 'react'
import $ from 'jquery'
import Button from './Button'
import Icon from './Icon'
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
    const starred = this.props.board.starred
    $.ajax({
      method: "POST",
      url: `/api/boards/${this.props.board.id}/${ starred ? 'unstar' : 'star'}`,
    }).then(() => {
      if (this.props.onChange) this.props.onChange()
    })
  }

  render(){
    const { board } = this.props
    return <Button
      className={`BoardStar BoardStar-${board.starred ? 'active' : 'inactive'}`}
      type="unstyled"
      title="Click to star this board. It will show up at the top of your boards list."
      onClick={this.toggleStar}
    >
      <Icon type="star-o" />
    </Button>
  }
}
