import React, { Component } from 'react'
import Link from './Link'
import Icon from './Icon'
import Form from './Form'
import Card from './BoardShowPage/Card'
import boardStore from '../stores/boardStore'
import './CardViewModal.sass'
import $ from 'jquery'

export default class CardViewModal extends Component {
  static propTypes = {
    card: React.PropTypes.object.isRequired,
    onClose: React.PropTypes.func.isRequired,
  }
  constructor(props){
    super(props)
    this.state = {
      editingDescription: false,
    }
    this.editDescription = this.editDescription.bind(this)
    this.stopEditingDescription = this.stopEditingDescription.bind(this)
    this.displayDescription = this.displayDescription.bind(this)
    this.updateCard = this.updateCard.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  onKeyDown(event) {
    const { card } = this.props
    const description = {
      description: this.refs.description.value,
    }
    if (!event.shiftKey && event.keyCode === 13) {
      event.preventDefault()
      this.updateCard(description)
    }
    if (event.keyCode === 27) {
      event.preventDefault()
      this.updateCard(description)
    }
  }

  editDescription(){
    this.setState({editingDescription: true})
  }

  stopEditingDescription(){
    this.setState({editingDescription: false})
  }

  displayDescription(description){
    if(description==''){
      description = 'Enter notes or a description here.'

    }
    return <div>
        {description}
      </div>
  }

  updateCard(description){
    const { card } = this.props
    $.ajax({
      method: 'post',
      url: `/api/cards/${card.id}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(description),
    }).then(() => {
      this.stopEditingDescription()
      boardStore.reload()
    })
  }


  render(){
    const description = this.displayDescription(this.props.card.description)
    const editDescriptionForm = this.state.editingDescription ?
      <Form className="CardViewModal-description-Edit" onSubmit={this.updateCard}>
        <textarea
          className="CardViewModal-description-Edit-input"
          onKeyDown={this.onKeyDown}
          ref="description"
          defaultValue={this.props.card.description}
        />
        <Link className="CardViewModal-description-Edit-cancel" onClick={this.stopEditingDescription}>
          <Icon type="times" />
        </Link>
        </Form> : <div className="CardViewModal-description-text">{description}</div>

    return <div className="CardViewModal">
      <div onClick={this.props.onClose} className="CardViewModal-shroud">
      </div>
      <div className="CardViewModal-stage">
        <div className="CardViewModal-window">
          <div className="CardViewModal-header">
            {this.props.card.content}
            <hr />
          </div>
          <div className="CardViewModal-details">
            <div className="CardViewModal-details-margin">
              <span className="CardViewModal-details-list">in List: {this.props.list.name}</span>
              <span className="CardViewModal-details-board">in Board: {this.props.board.name}</span>
              <div className="CardViewModal-description">
                <div className="CardViewModal-description-title">
                  Description
                  <Link className="CardViewModal-description-Edit-button" onClick={this.editDescription}>
                  <Icon type="pencil"/>
                </Link></div>
                {editDescriptionForm}
              </div>
              <div className="CardViewModal-comments">
              Add Comment:
                <Form className="CardViewModal-comments-Form">
                  <textarea
                    className="CardViewModal-comments-Form-input"
                    ref="comment"
                    defaultValue=''
                  />
                  <input type="submit" value="Send"/>
                </Form>
              </div>
            </div>
          </div>
        <div className="CardViewModal-controls">
          <div className="CardViewModal-controls-add">
            <span className="CardViewModal-controls-title">Add</span>
            <div className="CardViewModal-controls-add-buttons">
            </div>
          </div>
          <div className="CardViewModal-controls-actions">
            <span className="CardViewModal-controls-title">Actions</span>

          </div>
        </div>

      </div>
      </div>
    </div>
  }
}
