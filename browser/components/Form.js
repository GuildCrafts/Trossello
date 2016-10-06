import React, { Component } from 'react'
import './Form.sass'

class Form extends Component {
  render(){
    const props = Object.assign({}, this.props)
    props.className = `Form ${props.className||''}`
    return <form {...props}>{this.props.children}</form>
  }
}

export default Form
