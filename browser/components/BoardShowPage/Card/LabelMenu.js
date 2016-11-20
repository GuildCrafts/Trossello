import React, {Component} from 'react'
import $ from 'jquery'
import './LabelMenu.sass'
import CardLabel from './CardLabel'
import ColorBox from '../ColorBox'
import Link from '../../Link'
import Form from '../../Form'
import Icon from '../../Icon'
import Button from '../../Button'
import ActionsMenu from '../../ActionsMenu'
import ActionsMenuPane from '../../ActionsMenuPane'
import boardStore from '../../../stores/boardStore'

export default class LabelMenu extends Component {

  static propTypes = {
    card: React.PropTypes.object.isRequired,
    board: React.PropTypes.object.isRequired,
    onClose: React.PropTypes.func.isRequired
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
    $.ajax({
      method: 'POST',
      url:`/api/cards/${this.props.card.id}/labels/${labelId}`
    })
    .then(() => boardStore.reload())
  }

  render() {
    const { card, board } = this.props
    const boardLabels = board.labels.map( label => {
      const checked = card.labels.map(card => card.id).includes(label.id)
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
      card={this.props.card}
      board={this.props.board}
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
    this.state = {
      value: this.props.content || '',
      status: null,
      header: null,
      deleteButton: false,
      labelText:'',
      labelColor:'#fff',
    }
    this.deleteLabel = this.deleteLabel.bind(this)
    this.changeColor = this.changeColor.bind(this)
    this.createOrEditLabel = this.createOrEditLabel.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount(){
    if(this.props.state.editingLabel===null){
      this.setState({
        url: `/api/boards/${this.props.board.id}/labels`,
        header:"Create Label",
        deleteButton: false,
        labelText: '',
        labelColor: '#98A0A4'
      })
    } else {
      const label = this.props.board.labels.find(label => label.id===this.props.state.editingLabel)
      this.setState({
        url: `/api/boards/${this.props.board.id}/labels/${this.props.state.editingLabel}`,
        header:"Edit Label",
        deleteButton: true,
        labelText: label.text,
        labelColor: label.color,
      })
    }
  }

  deleteLabel(event) {
    event.preventDefault()
    $.ajax({
      method: 'POST',
      url: `/api/boards/${this.props.board.id}/labels/${this.props.state.editingLabel}/delete`
    })
    .then(() => {
      boardStore.reload()
      this.props.onClose(event)
    })
  }

  changeColor(event) {
    this.setState({labelColor: event.target.attributes.color.value})
  }

  createOrEditLabel(event){
    event.preventDefault()
    $.ajax({
      method: 'POST',
      url: this.state.url,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data:JSON.stringify({"text": this.state.labelText, "color": this.state.labelColor})
    })
    .then(() => {
      boardStore.reload()
      this.props.onClose(event)
    })
  }

  handleChange(event) {
    this.setState({labelText: event.target.value})
  }

  render() {
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
          onClose={this.props.onClose} />
      </div>
    })

    const deleteButton = this.state.deleteButton ?
      <Button
        className="LabelMenu-CreateLabelPanel-button"
        onClick={this.deleteLabel}
        type="danger"
        submit={false}
        > DeleteButton </Button> : null

    return <ActionsMenuPane
      heading={this.state.header}
      board={this.props.board}
      card={this.props.card}
      onClose={this.props.onClose}
      onBack={this.props.goToPane('Main Label Pane')}
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
            > {this.state.header}
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
