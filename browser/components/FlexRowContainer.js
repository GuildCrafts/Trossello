import React, {Component} from 'react'
import './FlexRowContainer.sass'

export default class FlexrowContainer extends Component {

  render(){
    const className = `FlexRowContainer ${this.props.className || ''}`
    return <div className={className} >
      {this.props.children}
    </div>
  }
}
