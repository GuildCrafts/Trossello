import React, { Component } from 'react'
import { Link } from 'simple-react-router'
import './Link.sass'

class TypedLink extends Component {
  static propTypes = {
    type: React.PropTypes.string,
    href: React.PropTypes.string,
  }

  constructor(props) {
    super(props);
  }

  render(){
    const props = Object.assign({}, this.props)
    props.type = this.props.type || 'default'
    props.href = props.href || props.to || ''
    props.onClick = props.onClick || null
    props.className = `Link Link-${props.type} ${props.className||''}`
    return <Link { ...props }>{ this.props.children }</Link>
  }
}


export default TypedLink
