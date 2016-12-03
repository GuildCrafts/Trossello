import React, {Component} from 'react'
import $ from 'jquery'
import Link from '../Link'
import Icon from '../Icon'
import './Label.sass'

export default class Label extends Component {

  constructor(props){
    super(props)
    this.state={}
  }

  render(){
    const {color, text, checked} = this.props
    const check = checked? <Icon type="check"/> : null

    return <div className="Label" style={{backgroundColor: color}}>
      <div className="Label-text">
      {text}
      </div>
      <div className="Label-check">
        {check}
      </div>
    </div>

  }

}
