import React, {Component} from 'react'
import $ from 'jquery'
import Icon from './Icon'
import './StarIcon.sass'

class StarIcon extends Component {

  static propTypes = {
    board: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired
  }

  constructor(props){
    super(props)
    this.toggleStar = this.toggleStar.bind(this)
  }

  toggleStar(event) {
    event.stopPropagation()
    event.preventDefault()
    let url = ""
    this.props.board.starred ? url = `/api/boards/${this.props.board.id}/unstar` :
    url = `/api/boards/${this.props.board.id}/star`
    $.ajax({
      method: "POST",
      url: url
    }).then(() => {
      this.props.onChange()
    })
  }

  render() {
    let className = "StarIcon "
    className += this.props.board.starred ? "StarIcon-active" : "StarIcon-inactive"
    return <Icon
      type="star-o"
      title="Click to star this board. It will show up at the top of your boards list."
      onClick={this.toggleStar}
      className={className} />
  }
}

export default StarIcon
