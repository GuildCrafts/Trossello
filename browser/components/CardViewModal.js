import React, { Component } from 'react'
import Link from './Link'
import Icon from './Icon'
import Form from './Form'
import Card from './BoardShowPage/Card'
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
    this.displayDescription = this.displayDescription.bind(this)
  }

  displayDescription(description){
    if(description==''){
      description="Enter notes or a description here."
    }
    return description
  }


  render(){
    const description= this.displayDescription(this.props.card.description)
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
            <span className="CardViewModal-details-list">in List: {this.props.list.name}</span>
            <span className="CardViewModal-details-board">in Board: {this.props.board.name}</span>
            <div className="CardViewModal-description">
              {description}
              <Link onClick={this.updateDescription}>
                <Icon type="pencil"/>
              </Link>
            </div>
            <div className="CardViewModal-comments">
              Comments:
              <Form className="CardViewModal-comments-Form">
                <textarea
                  className="CardViewModal-comments-Form-input"
                  ref="comment"
                  defaultValue=''
                />
                <input type="submit" value="Add Comment"/>
              </Form>
            </div>
          </div>
        <div className="CardViewModal-controls">
          <div className="CardViewModal-controls-add">
            Add
          </div>
          <div className="CardViewModal-controls-actions">
            Actions
          </div>
        </div>

      </div>
      </div>
    </div>
  }
}
