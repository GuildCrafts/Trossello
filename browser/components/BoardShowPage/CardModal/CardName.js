import React, { Component } from 'react'
import commands from '../../../commands'

export default class CardName extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.card.content,
    }
    this.setValue = this.setValue.bind(this)
    this.updateName = this.updateName.bind(this)
  }

  setValue(event) {
    this.setState({value: event.target.value})
  }

  updateName(){
    commands.updateCardAttribute(this.props.card.id, {content: this.state.value})
  }

  render() {
    return <input
      type="text"
      value={this.state.value}
      onChange={this.setValue}
      onBlur={this.updateName}
    />
  }
}
