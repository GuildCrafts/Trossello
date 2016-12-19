import React, {Component} from 'react'
import './LabelMenu.sass'
import CardLabel from './CardLabel'
import ColorBox from '../ColorBox'
import Link from '../../Link'
import Form from '../../Form'
import Icon from '../../Icon'
import Button from '../../Button'
import ConfirmationButton from '../../ConfirmationButton'
import ActionsMenu from '../../ActionsMenu'
import ActionsMenuPane from '../../ActionsMenuPane'
import boardStore from '../../../stores/boardStore'
import commands from '../../../commands'

export default class LabelMenu extends Component {

  static propTypes = {
    card: React.PropTypes.object.isRequired,
    board: React.PropTypes.object.isRequired,
    // onClose: React.PropTypes.func.isRequired
  }

  constructor(props){
    super(props)
    this.state = {
      editingLabel: null
    }
    this.editLabel = this.editLabel.bind(this)
  }

  editLabel(labelId){
    this.setState({editingLabel: labelId})
  }

  render(){
    const { card, board, onClose } = this.props
    return <ActionsMenu
      className="LabelMenu"
      defaultPane="Main Label Pane"
      paneProps={{
        state: this.state,
        onClose: this.props.onClose,
        card: this.props.card,
        board: this.props.board,
        editLabel: this.editLabel,
      }}
      panes={{
        "Main Label Pane": MainLabelPanel,
        "Create Label Pane": CreateLabelPanel,
      }}
    />
  }
}

class MainLabelPanel extends Component {


  editLabel(labelId, event){
    event.preventDefault()
    this.props.editLabel(labelId)
    this.props.goToPane('Create Label Pane')()
  }


  addOrRemoveLabel(labelId, event) {
    event.preventDefault()
    commands.addOrRemoveLabel(this.props.card.id, labelId)
  }

  render() {
    const { card, board } = this.props
    const boardLabels = board.labels.map( label => {
      const checked = card.label_ids.includes(label.id)
      return <LabelRow
        key={label.id}
        checked={checked}
        label={label}
        onEdit={this.editLabel.bind(this, label.id)}
        onClick={this.addOrRemoveLabel.bind(this, label.id)}
      />
    })

    return <ActionsMenuPane
      heading="Labels"
      onClose={this.props.onClose}
      className="LabelMenu-MainLabelPane"
    >
      <div className="LabelMenu-labels">
        {boardLabels}
      </div>
      <div className="LabelMenu-controls">
        <Link className="LabelMenu-button" onClick={this.props.goToPane('Create Label Pane')}>
          Create Label
        </Link>
      </div>
    </ActionsMenuPane>
  }
}


const LabelRow = (props) => {
  const {label, onClick, onEdit, checked} = props

  return <div className="LabelMenu-LabelRow">
    <div className="LabelMenu-LabelRow-box" onClick={onClick}>
      <CardLabel key={label.id} color={label.color} text={label.text} checked={checked}/>
    </div>
    <Link onClick={onEdit} className="LabelMenu-LabelRow-edit"><Icon type="pencil" /></Link>
  </div>
}

class CreateLabelPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {}

    if (props.state.editingLabel === null){
      this.state.labelText = ''
      this.state.labelColor = '#98A0A4'
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

    const colorBoxes = colors.map(color => {
      const checked = (this.state.labelColor===color) ? true : false
      return <div
        key={color}
        className="LabelMenu-CreateLabelPanel-colorbox">
        <ColorBox
          checked={checked}
          color={color}
          boardId={this.props.board.id}
          onClick={this.changeColor}
          onClose={this.props.onClose}
        />
      </div>
    })

    const deleteButton = this.isEditing() ?
      <ConfirmationButton
        className="LabelMenu-CreateLabelPanel-button"
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
      className="LabelMenu-CreateLabelPanel"
    >
      <Form
        method="post"
        onSubmit={this.createOrEditLabel}
        className="LabelMenu-CreateLabelPanel-Form"
      >
        <input type="text" placeholder="Card Text" value={this.state.labelText} onChange={this.handleChange}/>
        <div className="LabelMenu-CreateLabelPanel-colors">{colorBoxes}</div>
        <br/>
        <div className="LabelMenu-CreateLabelPanel-controls">
          <Button
            className="LabelMenu-CreateLabelPanel-button"
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

const colors = [
  "#0079bf",
  "#d8a359",
  "#70a95d",
  "#bc6858",
  "#9d7cae",
  "#d478a4",
  "#6cc885",
  "#30bbd3",
  "#98a0a4"
]
