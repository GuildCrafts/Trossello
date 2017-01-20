import React, { Component } from 'react'
import Link from '../../Link'
import Icon from '../../Icon'
import ColorLabel from './ColorLabel'
import './TextLabel.sass'

export default class TextLabel extends Component {

  static propTypes = {
    color: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    checked: React.PropTypes.bool.isRequired,
  }

  render(){
    const {color, text, checked} = this.props
    const check = checked ?
      <div className="Card-TextLabel-check">
        <Icon type="check"/>
      </div> : null

    return <ColorLabel
      className={this.props.className || ''}
      color={color}
      checked={checked}
    >
      {text}
    </ColorLabel>
  }
}
