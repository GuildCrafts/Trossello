import React, { Component } from 'react'
import ContentForm from './ContentForm'
import Form from '../Form'
import Link from '../Link'
import Icon from '../Icon'
import Card from '../Card'
import Button from '../Button'
import ArchiveButton from './ArchiveButton'
import boardStore from '../../stores/boardStore'
import autosize from 'autosize'
import sessionStorage from '../../sessionStorage'
import commands from '../../commands'
const KEY = "EditCardFormContent"

export default class EditCardForm extends Component {

  static propTypes = {
    card: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func,
    onCancel: React.PropTypes.func.isRequired,
    onSave: React.PropTypes.func.isRequired,
    hideCloseX: React.PropTypes.bool,
    submitOnEnter: React.PropTypes.bool,
  };

  static defaultProps = {
    hideCloseX: true,
    submitOnEnter: true,
  };

  constructor(props){
    super(props)
    this.onSave = this.onSave.bind(this)
  }

  onSave(content){
    const { card } = this.props
    commands.editCardForm(card.id, content)
      .then( _ => {
          if (this.props.onSave) this.props.onSave(card)
      })
  }

  render() {
    return <ContentForm
      className="BoardShowPage-EditCardForm"
      onChange={this.props.onChange}
      onCancel={this.props.onCancel}
      onSave={this.onSave}
      submitButtonName="Save"
      defaultValue={this.props.card.content}
      hideCloseX={this.props.hideCloseX}
      submitOnEnter={this.props.submitOnEnter}
    />
  }
}
