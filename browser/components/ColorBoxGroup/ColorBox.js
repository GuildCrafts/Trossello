import React, {Component} from 'react'
import boardStore from '../../stores/boardStore'
import Icon from '../Icon'
import './ColorBox.sass'

export default class ColorBox extends Component {
  render(){
    const {color, boardId, onClick, checked} = this.props
    const checkMark = checked ? <Icon type='check'/> : null
    const className = this.props.className
    ? `ColorBox ColorBox-${color} ${this.props.className}`
    : `ColorBox ColorBox-${color}`

    return <div
      onClick={onClick}
      color={color}
      className={className}
    >
      {checkMark}
    </div>
  }
}
