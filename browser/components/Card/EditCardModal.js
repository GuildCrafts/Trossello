import React, { Component } from 'react'
import EditCardForm from '../BoardShowPage/EditCardForm'
import './EditCardModal.sass'

export default class EditCardModal extends Component {
  static propTypes = {
    card:    React.PropTypes.object.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onSave:  React.PropTypes.func.isRequired,
    top:     React.PropTypes.number.isRequired,
    left:    React.PropTypes.number.isRequired,
    width:   React.PropTypes.number.isRequired,
  }
  constructor(props){
    super(props)
    this.cancel = this.cancel.bind(this)
  }

  stopPropagation(event){
    event.preventDefault()
    event.stopPropagation()
  }

  cancel(){
    this.props.onCancel()
  }

  render(){
    const style = {
      top: this.props.top,
      left: this.props.left,
      width: this.props.width+'px',
    }
    return <div
        className="Card-EditCardModal"
      >
      <div
        className="Card-EditCardModal-shroud"
        onMouseDown={this.stopPropagation}
        onClick={this.cancel}
      />
      <div style={style} className="Card-EditCardModal-window">
        <EditCardForm
          card={this.props.card}
          onCancel={this.cancel}
          submitButtonName="Save"
          onSave={this.props.onSave}
          hideCloseX
        />
      </div>
    </div>
  }
}
