import './CardSearchForm.sass'
import React, { Component } from 'react'
import Form from './Form'
import Link from './Link'
import Icon from './Icon'
import $ from 'jquery'
import Card from './BoardShowPage/Card'

export default class CardSearchForm extends Component {

  constructor(props){
    super(props)
    this.state = {
      focused: false,
      searchTerm: '',
      result: null
    }
    this.setSearchTerm = this.setSearchTerm.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.search = this.search.bind(this)
    this.close = this.close.bind(this)
    this.focus = this.focus.bind(this)
    this.blur = this.blur.bind(this)
    this.focusOnSlash = this.focusOnSlash.bind(this)
  }

  componentDidMount(){
    $('body').on('keydown', this.focusOnSlash)
  }

  componentWillUnmount(){
    $('body').off('keydown', this.focusOnSlash)
  }

  focusOnSlash(event){
    if (event.key === '/' && event.target !== this.refs.content){
      event.preventDefault()
      this.refs.content.focus()
    }
  }

  focus(event){
    this.setState({ focused: true })
  }

  blur(event){
    if (!this.state.result){
      this.setState({
        focused: false,
        searchTerm: '',
        result: null,
      })
    }else{
      this.setState({
        focused: false,
      })
    }
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
    if (event.key === "Escape") {
      event.preventDefault()
      this.close()
      this.refs.content.blur()
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
    const icon = this.state.focused ?
      <Icon type="times"  className="CardSearchForm-cancel-icon" /> :
      <Icon type="search" className="CardSearchForm-search-icon" />

    return <Form className="CardSearchForm" onSubmit={this.search} >
      <input
        type="text"
        onKeyDown={this.onKeyDown}
        className="CardSearchForm-Input"
        ref="content"
        value={this.state.searchTerm}
        onChange={this.setSearchTerm}
        onFocus={this.focus}
        onBlur={this.blur}
      />
      {icon}
      {searchResultModal}
    </Form>
  }


}

class SearchResultModal extends Component {

  render() {
    const { result, searchTerm, onClose } = this.props

    const cardNodes = result.map(card =>
      <Card
        key={card.id}
        card={card}
        editable={false}
        onClick={this.props.onClose}
      />
    )

    const searchDisplay = result.length === 0 ?
      <div className="CardSearchForm-Result-Message">
        <h5>No cards or boards were found matching your search</h5>
      </div> :
      <div className="CardSearchForm-Modal-window-results">
        {cardNodes}
      </div>

    return <div className="CardSearchForm-Modal">
      <div ref="shroud" className="CardSearchForm-Modal-shroud" onClick={this.props.onClose} />
      <div ref="window" className="CardSearchForm-Modal-window">
        <h5 className="CardSearchForm-Result-Title">Card Search Results For: &quot;{this.props.searchTerm}&quot;</h5>
        <Link className="CardSearchForm-Modal-window-close" onClick={this.props.onClose}>
          <Icon type="times" />
        </Link>
        {searchDisplay}
      </div>
    </div>
  }
}
