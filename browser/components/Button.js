import React, { Component } from 'react'
import './Button.sass'

class Button extends Component {
  static propTypes = {
    type: React.PropTypes.string,
    href: React.PropTypes.string,
  }
  render(){
    const type = this.props.type || 'default'
    const props = Object.assign({}, this.props)
    delete props.type
    props.className = `Button Button-${type} ${props.className||''}`
    return props.href ?
      <a {...props}>{this.props.children}</a> :
      <button {...props}>{this.props.children}</button>
  }
}

export default Button
