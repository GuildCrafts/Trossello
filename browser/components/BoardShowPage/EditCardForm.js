import React, { Component } from 'react'
import $ from 'jquery'
import ContentForm from '../ContentForm'

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
    $.ajax({
      method: 'post',
      url: `/api/cards/${card.id}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({content}),
    }).then(updatedCard => {
      boardStore.reload().then(_ => {
        if (this.props.onSave) this.props.onSave(card)
      })
    })
  }

  render() {
    return <ContentForm
      className="EditCardForm"
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
