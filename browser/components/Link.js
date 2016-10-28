import React, { Component } from 'react'
import { Link } from 'simple-react-router'
import './Link.sass'

class TypedLink extends Component {
  static propTypes = {
    type: React.PropTypes.string,
    href: React.PropTypes.string,
  }

  render(){
    const props = Object.assign({}, this.props)
    delete props.type
    props.href = props.href || props.to || ''
    delete props.to
    props.className = `Link Link-${this.props.type || 'default'} ${props.className||''}`
    return <Link { ...props }>{ this.props.children }</Link>
  }
}


export default TypedLink
