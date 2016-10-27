import './CardSearchForm.sass'
import React, { Component } from 'react'
import Form from './Form'
import Link from './Link'
import Icon from './Icon'
import $ from 'jquery'
import Card from './BoardShowPage/Card'

export default class CardSearchForm extends Component {

  static contextTypes = {
    session: React.PropTypes.object.isRequired
  }
  constructor(props){
    super(props)
    this.state = {
      searchTerm: '',
      result: null
    }
    this.setSearchTerm = this.setSearchTerm.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.search = this.search.bind(this)
    this.close = this.close.bind(this)
  }


  setSearchTerm(event){
    const searchTerm = event.target.value
    this.setState({searchTerm})
  }


  close(){
    this.setState({
      searchTerm: '',
      result: null,
    })
  }


  onKeyDown(event) {
    if (!event.shiftKey && event.keyCode === 13) {
      event.preventDefault()
      this.search(event)
    }
    if (event.keyCode === 27) {
      event.preventDefault()
      this.close()
    }
  }

  search(event) {
    event.preventDefault()
    $.ajax({
      method: "POST",
      url: "/api/boards/search",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify({searchTerm: this.state.searchTerm}),
    })
    .then(result => {
      this.setState({result})
      boardStore.reload()
    })
    .catch(error => {
      console.error(error)
    })
  }


  render(){
    const searchResultModal = this.state.result ?
      <SearchResultModal
        className="CardSearchForm-Result"
        onClose={this.close}
        searchTerm={this.state.searchTerm}
        result={this.state.result}
      /> :
      null

    return <Form className="CardSearchForm" onSubmit={this.search} >
      <input
        type="text"
        onKeyDown={this.onKeyDown}
        className="CardSearchForm-Input"
        ref="content"
        value={this.state.searchTerm}
        onChange={this.setSearchTerm}
      />
      {searchResultModal}
    </Form>
  }


}

class SearchResultModal extends Component {
  render() {
    const { result, searchTerm, onClose } = this.props
    const cardNodes = result.map(card => {
      if(card.archived===false){
        return <Card key={card.id} card={card} archivable={false} editable={false} />
      }
    })
    return <div className="CardSearchForm-Modal">
      <div ref="shroud" className="CardSearchForm-Modal-shroud" onClick={this.props.onClose} />
      <div ref="window" className="CardSearchForm-Modal-window">
        <h5 className="CardSearchForm-Result-Title">Card Search Results For: &quot;{this.props.searchTerm}&quot;</h5>
        <Link className="CardSearchForm-Modal-window-close" onClick={this.props.onClose}>
          <Icon type="times" />
        </Link>
        <div className="CardSearchForm-Modal-window-results">
          {cardNodes}
        </div>
      </div>
    </div>
  }
}
