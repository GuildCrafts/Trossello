import React, {Component} from 'react'
import $ from 'jquery'
import boardStore from '../../stores/boardStore'
import Icon from '../Icon'
import './ColorBox.sass'

export default class ColorBox extends Component {

  render(){
    const {color, boardId, onClick, className, checked} = this.props
    const checkMark = checked ? <Icon type='check'/> : null

    return <div
      onClick={onClick}
      color={color}
      style={{backgroundColor: color}}
      className="ColorBox"
    >
      {checkMark}
    </div>
  }
}
