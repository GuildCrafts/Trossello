import React, { Component } from 'react'
import ConfirmationButton from '../../ConfirmationButton'
import Icon from '../../Icon'
import commands from '../../../commands'

export default class DeleteCardButton extends Component {
  static propTypes = {
    card: React.PropTypes.object.isRequired,
    onDelete: React.PropTypes.func.isRequired,
  }

  constructor(props){
    super(props)
    this.delete = this.delete.bind(this)
  }

  delete(){
    commands.deleteCard(id).then(this.props.onDelete)
  }

  render(){
    return <ConfirmationButton
      onConfirm={this.delete}
      buttonName='Delete'
      title='Delete Card?'
      message='All actions will be removed from the activity feed and you won’t be able to re-open the card. There is no undo.'
      className='BoardShowPage-CardModal-Controls-delete'
    >
      <Icon type="trash" /> Delete
    </ConfirmationButton>
  }
}
