import React, {Component} from 'react'
import $ from 'jquery'
import Link from '../Link'
import Form from '../Form'
import Label from './Label'
import Icon from '../Icon'
import Button from '../Button'
import ColorBox from './ColorBox'
import boardStore from '../../stores/boardStore'
import './LabelMenu.sass'

export default class LabelMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      creatingLabel: false,
      editingLabel: null,
      currentText: '',
      currentColor: null
    }
    this.openCreateLabelPanel = this.openCreateLabelPanel.bind(this)
    this.closeCreateLabelPanel = this.closeCreateLabelPanel.bind(this)
    this.editLabelText= this.editLabelText.bind(this)
    this.setColor = this.setColor.bind(this)
    this.addOrRemoveLabel = this.addOrRemoveLabel.bind(this)
  }

  addOrRemoveLabel(labelId, event) {
    event.preventDefault()
    $.ajax({
      method: 'POST',
      url:`/api/cards/${this.props.card.id}/labels/${labelId}`
    })
    .then(() => boardStore.reload())
  }

  editLabelText(event) {
    event.preventDefault()
    const {label, content, color} = event.currentTarget.attributes
    boardStore.reload()
    this.setState({creatingLabel: true,
      editingLabel: label.value,
      currentText: content.value,
      currentColor: color.value
    })
  }

  setColor(color) {
    this.setState({currentColor: color})
  }

  openCreateLabelPanel(event) {
    event.preventDefault()
    this.setState({
      creatingLabel: true,
      currentText: '',
      editingLabel: null,
      currentColor: null
    })
  }

  closeCreateLabelPanel(event) {
    this.setState({creatingLabel: false,
      editingLabel: null,
      currentText: null,
      currentColor: null,
    })
  }

  render() {
    const { card, board } = this.props
    const boardLabels = board.labels.map( label => {
      let checked = false
      card.labels.forEach(card_label => {if(card_label.id===label.id) return checked=true} )
      return <div className="LabelMenu-labels-block">
        <div className="LabelMenu-labels-box" onClick={this.addOrRemoveLabel.bind(null, label.id)}>
          <Label key={label.id} id={label.id} cardId={card.id} color={label.color} text={label.text} checked={checked} className="LabelMenu-labels-Label"/>
        </div>
        <Link label={label.id} content={label.text} color={label.color} onClick={this.editLabelText} className="LabelMenu-labels-edit"><Icon type="pencil" /></Link>
      </div>
    })
    const createLabelPanel = this.state.creatingLabel ?
      <CreateLabelPanel content={this.state.currentText} currentColor={this.state.currentColor} labelId={this.state.editingLabel} boardId={board.id} createLabel={this.createLabel} setColor={this.setColor} onClose={this.closeCreateLabelPanel}/> : null

    return <div className="LabelMenu">
      <div className="LabelMenu-header">
        <div className="LabelMenu-header-title">Labels</div>
        <div className="LabelMenu-header-close">
          <Link onClick={this.props.onClose}><Icon size="0" type="times"/></Link>
        </div>
      </div>
      <div className="LabelMenu-labels">
        {boardLabels}
      </div>
      <div className="LabelMenu-controls">
        <Link className="LabelMenu-button"
        onClick={this.openCreateLabelPanel}>
            Create Label
        </Link>
      </div>
      {createLabelPanel}
    </div>
  }
}

class CreateLabelPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {value: this.props.content || ''}

    this.deleteLabel = this.deleteLabel.bind(this)
    this.changeColor = this.changeColor.bind(this)
    this.createOrEditLabel = this.createOrEditLabel.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
    this.setState({value: nextProps.content})
    }
  }

  deleteLabel(event) {
    event.preventDefault()
    $.ajax({
      method: 'POST',
      url: `/api/boards/${this.props.boardId}/labels/${this.props.labelId}/delete`
    })
    .then(() => {
      boardStore.reload()
      onClose()
    })
  }

  changeColor(event) {
    this.props.setColor(event.target.attributes.color.value)
  }

  createOrEditLabel(url, event) {
    event.preventDefault()

    const text = event.target[0].value
    $.ajax({
      method: 'POST',
      url: url,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data:JSON.stringify({"text": text, "color": this.props.currentColor})
    })
    .then(() => {
      boardStore.reload()
      this.props.onClose()
    })
  }

  handleChange(event) {
    this.setState({value: event.target.value})
  }

  render() {
    const {labelId, onClose, boardId, currentColor, content} = this.props

    const colorBoxes = colors.map(color => {
      const checked = (currentColor===color) ? true : false
      return <div className="LabelMenu-CreateLabelPanel-colorbox"><ColorBox checked={checked} key={color} color={color} boardId={boardId} onClick={this.changeColor} onClose={onClose} /></div>
    })

    let url
    let title
    let deleteButton

    if(labelId===null){
      url = `/api/boards/${boardId}/labels`
      title = "Create Label"
      deleteButton = null
    } else {
      url = `/api/boards/${boardId}/labels/${labelId}`
      title = "Edit Label"
      deleteButton = <Button className="LabelMenu-CreateLabelPanel-button" onClick={this.deleteLabel} type="danger" submit={false} >Delete Label</Button>
    }

    return <div className="LabelMenu-CreateLabelPanel">
      <div className="LabelMenu-CreateLabelPanel-header">
      <div className="LabelMenu-CreateLabelPanel-header-title">{title}</div>
      <Link onClick={onClose} className="LabelMenu-CreateLabelPanel-header-close">
      <Icon size="0" type="times"/></Link>
      </div>
      <Form method="post" onSubmit={this.createOrEditLabel.bind(null, url)} className="LabelMenu-CreateLabelPanel-Form">
        <input type="text" placeholder="Card Text" value={this.state.value} onChange={this.handleChange}/>
        <div className="LabelMenu-CreateLabelPanel-colors">{colorBoxes}</div>
        <br/>
        <div className="LabelMenu-CreateLabelPanel-controls">
          <Button className="LabelMenu-CreateLabelPanel-button" type="primary" submit={true}>{title}</Button>
          {deleteButton}
        </div>
      </Form>
    </div>
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
