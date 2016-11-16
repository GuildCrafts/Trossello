import React, { Component } from 'react'
import './NewListForm.sass'
import ToggleComponent from '../ToggleComponent'
import Form from '../Form'
import Link from '../Link'
import Icon from '../Icon'
import Button from '../Button'
import $ from 'jquery'
import boardStore from '../../stores/boardStore'

export default class NewListForm extends ToggleComponent {

  render(){
    const content = this.state.open ?
      <Open
        close={this.close}
        board={this.props.board}
        afterCreate={this.props.afterCreate}
      /> :
      <Closed open={this.open} />

    return <div className="BoardShowPage-NewListForm">
      {content}
    </div>
  }
}

const Closed = (props) => {
  return <Link
    className="BoardShowPage-NewListForm-Link"
    onClick={props.open}
  >
    Add a list…
  </Link>
}

class Open extends Component {
  constructor(props){
    super(props)
    this.createList = this.createList.bind(this)
  }

  componentDidMount(){
    this.refs.name.focus()
  }

  createList(event){
    event.preventDefault()
    const { board, onCreateList } = this.props
    const newList = {
      name: this.refs.name.value,
      archived: false
    }
    if (newList.name.replace(/\s+/g,'') === '') return
    this.refs.name.value = ''
    $.ajax({
      method: "post",
      url: `/api/boards/${board.id}/lists`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(newList),
    }).then(() => {
      boardStore.reload()
      this.props.afterCreate()
    })
  }

  render(){
    return <div className="BoardShowPage-NewListForm-Form">
      <Form onSubmit={this.createList}>
        <input type="text" ref="name" />
        <div>
          <Button type="primary" action="submit" className="button">Save</Button>
          <Link onClick={this.props.close}>
            <Icon type="times" />
          </Link>
        </div>
      </Form>
    </div>
  }
}
