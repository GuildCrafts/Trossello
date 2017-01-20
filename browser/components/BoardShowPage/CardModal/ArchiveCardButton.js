import React, { Component } from 'react'
import ConfirmationButton from '../../ConfirmationButton'
import Icon from '../../Icon'
import commands from '../../../commands'

export default class ArchiveCardButton extends Component {
  static propTypes = {
    card: React.PropTypes.object.isRequired,
  }
  constructor(props){
    super(props)
    this.archiveCard = this.archiveCard.bind(this)
  }
  archiveCard(){
    commands.archiveCard(this.props.card.id)
  }
  render(){
    return <ConfirmationButton
      className="BoardShowPage-CardModal-ArchiveCardButton"
      onConfirm={this.archiveCard}
      buttonName="Archive"
      title='Archive Card?'
      message='Are you sure you want to archive this card?'
    >
      <Icon type="archive" /> Archive
    </ConfirmationButton>
  }
}
