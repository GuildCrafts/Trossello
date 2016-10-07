import React, { Component } from 'react'
import $ from 'jquery'
import './CreateBoardPopover.sass'
import Link from './Link'
import Icon from './Icon'
import Form from './Form'
import boardsStore from '../stores/boardsStore'

class CreateBoardPopover extends Component {

  static contextTypes = {
    redirectTo: React.PropTypes.func,
  }

  constructor(props){
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount(){
    this.refs.name.focus()
  }

  onSubmit(event){
    event.preventDefault()
    const board = {
      name: this.refs.name.value,
      background_color: this.refs.color.value,
    }
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
    const closeLink = this.props.onClose ?
      <Link onClick={this.props.onClose}>
        <Icon type="times" />
      </Link> :
      null

    return <div ref="root" className="CreateBoardPopover">
      <div className="CreateBoardPopover-header">
        Create A Board
        {closeLink}
        <hr/>
      </div>
      <Form onSubmit={this.onSubmit}>
        <label>
          <div>Name</div>
          <input type="text" ref="name"/>
        </label>
        <label>
          <div>Color</div>
          <input type="text" ref="color" placeholder="#2E86AB" />
        </label>
        <input type="submit" value="Create" />
      </Form>
    </div>
  }
}

export default CreateBoardPopover
