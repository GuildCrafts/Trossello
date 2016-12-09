import React, {Component} from 'react'
import Link from '../../Link'
import Icon from '../../Icon'
import './CardLabel.sass'

export default class CardLabel extends Component {

  static propTypes = {
    color: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    checked: React.PropTypes.bool.isRequired,
  }

  render(){
    const {color, text, checked} = this.props
    const check = checked ?
      <div className="CardLabel-check">
        <Icon type="check"/>
      </div> : null

    return <div className="CardLabel" style={{backgroundColor: color}}>
      <div className="CardLabel-text">
        {text}
      </div>
      {check}
    </div>

  }

}
