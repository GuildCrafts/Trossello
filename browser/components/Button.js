import React, { Component } from 'react'
import './Button.sass'

class Button extends Component {
  static propTypes = {
    type: React.PropTypes.string,
    href: React.PropTypes.string,
    submit: React.PropTypes.bool,
  }
  render(){
    const type = this.props.type || 'default'
    const props = Object.assign({}, this.props)
    delete props.type
    if (props.submit){
      delete props.submit
      delete props.href
      props.type = 'submit'
    }
    props.className = `Button Button-${type} ${props.className||''}`
    return props.href ?
      <a ref="button" {...props}>{this.props.children}</a> :
      <button ref="button" {...props}>{this.props.children}</button>
  }
}

export default Button
