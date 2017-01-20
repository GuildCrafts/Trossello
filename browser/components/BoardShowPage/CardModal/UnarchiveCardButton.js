import React, { Component } from 'react'
import Button from '../../Button'
import Icon from '../../Icon'
import commands from '../../../commands'

export default class UnarchiveCardButton extends Component {
  static propTypes = {
    card: React.PropTypes.object.isRequired
  }
  constructor(props){
    super(props)
    this.unarchive = this.unarchive.bind(this)
  }

  unarchive(){
    commands.unarchiveCard(this.props.card.id)
  }

  render(){
    return <Button
      onClick={this.unarchive}
    >
      <Icon type="refresh" /> Return to Board
    </Button>
  }
}
