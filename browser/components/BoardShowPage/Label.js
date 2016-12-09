import React, {Component} from 'react'
import $ from 'jquery'
import Link from '../Link'
import Icon from '../Icon'
import './Label.sass'

export default class Label extends Component {

  static propTypes = {
    color: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    checked: React.PropTypes.bool.isRequired,
  }

  render(){
    const {color, text, checked} = this.props
    const check = checked ?
      <div className="Label-check">
        <Icon type="check"/>
      </div> : null

    return <div className="Label" style={{backgroundColor: color}}>
      <div className="Label-text">
        {text}
      </div>
      {check}
    </div>

  }

}
