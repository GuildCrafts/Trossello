import React, { Component } from 'react'
import './Button.sass'

class Button extends Component {
  static propTypes = {
    type: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.bool,
    ]),
    href: React.PropTypes.string,
    submit: React.PropTypes.bool,
  }
  render(){
    const type = this.props.type === false ? false : this.props.type || 'default'
    const props = Object.assign({}, this.props)
    delete props.type
    delete props.submit
    if (this.props.submit){
      delete props.href
      props.type = 'submit'
    }
    const buttonTypeClassName = type ? `Button-${type}` : ''
    props.className = `Button ${buttonTypeClassName} ${props.className||''}`
    return props.href ?
      <a ref="button" {...props}>{this.props.children}</a> :
      <button ref="button" {...props}>{this.props.children}</button>
  }
}

export default Button
