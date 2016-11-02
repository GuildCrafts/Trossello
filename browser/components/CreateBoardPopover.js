import React, { Component } from 'react'
import $ from 'jquery'
import './CreateBoardPopover.sass'
import Link from './Link'
import Icon from './Icon'
import Form from './Form'
import Button from './Button'
import boardsStore from '../stores/boardsStore'
import DialogBox from './DialogBox'


class CreateBoardPopover extends Component {

  static contextTypes = {
    redirectTo: React.PropTypes.func,
  }

  constructor(props){
    super(props)
    this.state = {
      color: '',
    }
    this.updateColor = this.updateColor.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount(){
    this.refs.name.focus()
  }

  updateColor(event, color){
    if (event.target === this.refs.color)
      color = event.target.value
    this.setState({color})
  }

  onClick(event){
    event.preventDefault()
  }

  onSubmit(event){
    event.preventDefault()
    const board = {
      name: this.refs.name.value,
      background_color: this.refs.color.value,
      archived: false
    }
    if (board.name.replace(/\s+/g,'') === '') return
    $.ajax({
      method: "POST",
      url: '/api/boards',
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(board),
    }).then((board) => {
      if (this.props.onClose) this.props.onClose()
      boardsStore.reload()
      this.context.redirectTo('/boards/'+board.id)
      this.reset()
    })
  }

  reset(){
    if (this.refs.name) this.refs.name.value = ''
    if (this.refs.color) this.refs.color.value = ''
  }

  render(props){
    const colorBoxes = colors.map(color =>
      <ColorBox key={color} color={color} onClick={this.updateColor} />
    )

    return <div className="CreateBoardPopover">
        <DialogBox heading="Create A Board" onClose={this.props.onClose}>
        <Form onSubmit={this.onSubmit}>
          <label>
            <div>Name</div>
            <input type="text" ref="name"/>
          </label>
          <div className="CreateBoardPopover-createBackgroundColor">
            {colorBoxes}
          </div>
          <label>
            <input
              type="text"
              ref="color"
              placeholder="#2E86AB"
              value={this.state.color || ''}
              onChange={this.updateColor}
            />
          </label>
          <Button type="primary" action="submit">Create</Button>
        </Form>
      </DialogBox>
    </div>
  }
}

const ColorBox = (props) => {
  const {onClick, color} = props
  return <div
    onClick={(event)=>{ onClick(event, color) }}
    style={{backgroundColor: color}}
    className="CreateBoardPopover-createBackgroundColor-box"
  />
}

const colors = [
  "#0079bf",
  "#61bd4f",
  "#f2d600",
  "#ffab4a",
  "#eb5a46",
  "#c377e0",
  "#ff80ce",
  "#00c2e0"
]

export default CreateBoardPopover
