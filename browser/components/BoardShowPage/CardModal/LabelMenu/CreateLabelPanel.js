import React, { Component } from 'react'
import commands from '../../../../commands'
import ConfirmationButton from '../../../ConfirmationButton'
import Form from '../../../Form'
import Button from '../../../Button'
import ColorBoxGroup from '../../../ColorBoxGroup'
import ActionsMenuPane from '../../ActionsMenuPane'

export default class CreateLabelPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    if (props.state.editingLabel === null){
      this.state.labelText = ''
      this.state.labelColor = 'grey'
    } else {
      const label = this.labelBeingEdited(props)
      this.state.labelText = label.text
      this.state.labelColor = label.color
    }

    this.deleteLabel = this.deleteLabel.bind(this)
    this.changeColor = this.changeColor.bind(this)
    this.createOrEditLabel = this.createOrEditLabel.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.goBack = this.goBack.bind(this)
  }

  labelBeingEdited(props=this.props){
    return this.isEditing(props) &&
      props.board.labels.find(label => label.id === props.state.editingLabel)
  }

  isEditing(props=this.props){
    return typeof props.state.editingLabel === 'number'
  }

  goBack(){
    this.props.goToPane('Main Label Pane')()
  }

  deleteLabel(event) {
    if (event) event.preventDefault()
    commands.deleteLabel(this.props.board.id, this.props.state.editingLabel).then(this.goBack)
  }

  changeColor(event) {
    if (event) event.preventDefault()
    this.setState({labelColor: event.target.attributes.color.value})
  }

  createOrEditLabel(event){
    if (event) event.preventDefault()
    this.isEditing() ? this.updateLabel() : this.createLabel()
  }

  updateLabel(){
    commands.updateLabel(
      this.props.board.id,
      this.props.state.editingLabel,
      {
        text: this.state.labelText,
        color: this.state.labelColor
      }
    )
      .then(this.goBack)
  }

  createLabel(){
    commands.createLabel(this.props.board.id, {
      text: this.state.labelText,
      color:this.state.labelColor,
      cardId: this.props.card.id,
    }).then(this.goBack)
  }

  handleChange(event) {
    this.setState({labelText: event.target.value})
  }

  render() {
    const labelBeingEdited = this.labelBeingEdited()
    const header = this.isEditing() ? "Edit Label" : "Create Label"

    const deleteButton = this.isEditing() ?
      <ConfirmationButton
        className="BoardShowPage-CardModal-LabelMenu-CreateLabelPanel-button BoardShowPage-CardModal-LabelMenu-CreateLabelPanel-delete"
        onConfirm={this.deleteLabel}
        type="danger"
        submit={false}
        title={`Delete Label`}
        message={`Are you sure you want to delete the "${labelBeingEdited.text}" label?`}
        buttonName="Delete"
      >
        Delete
      </ConfirmationButton> : null

    return <ActionsMenuPane
      heading={header}
      board={this.props.board}
      card={this.props.card}
      onClose={this.props.onClose}
      onBack={this.goBack}
      className="BoardShowPage-CardModal-LabelMenu-CreateLabelPanel"
    >
      <Form
        method="post"
        onSubmit={this.createOrEditLabel}
        className="BoardShowPage-CardModal-LabelMenu-CreateLabelPanel-Form"
      >
        <input type="text" placeholder="Card Text" value={this.state.labelText} onChange={this.handleChange}/>
        <ColorBoxGroup
          className="BoardShowPage-CardModal-LabelMenu-CreateLabelPanel-colors"
          onClick={this.changeColor}
          onClose={this.props.onClose}
          board={this.props.board}
          currentColor={this.state.labelColor}
        />
        <br/>
        <div className="BoardShowPage-CardModal-LabelMenu-CreateLabelPanel-controls">
          <Button
            className="BoardShowPage-CardModal-LabelMenu-CreateLabelPanel-button BoardShowPage-CardModal-LabelMenu-CreateLabelPanel-save"
            type="primary"
            submit={true}
          >
            Save
          </Button>
          {deleteButton}
        </div>
      </Form>
    </ActionsMenuPane>
  }
}
