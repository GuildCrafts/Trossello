import './CardSearchForm.sass'
import $ from 'jquery'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import debounce from 'throttle-debounce/debounce'
import Form from './Form'
import Link from './Link'
import Icon from './Icon'
import Spinner from './Spinner'
import Card from './BoardShowPage/Card'
import commands from '../commands'

export default class CardSearchForm extends Component {

  constructor(props){
    super(props)
    this.state = {
      focused: false,
      searchTerm: '',
      result: [],
      modalDisplayed: false,
      loading: false,
    }
    this.setSearchTerm = this.setSearchTerm.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.search = debounce(200, this.search.bind(this))
    this.close = this.close.bind(this)
    this.focus = this.focus.bind(this)
    this.focusOnSlash = this.focusOnSlash.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount(){
    $('body').on('keydown', this.focusOnSlash)
  }

  componentWillUnmount(){
    $('body').off('keydown', this.focusOnSlash)
  }

  focusOnSlash(event){
    if (
      event.key === '/' &&
      event.target !== this.refs.content &&
      !$(event.target).is(':input')
    ){
      event.preventDefault()
      this.refs.content.focus()
    }
  }

  focus(){
    this.setState({ focused: true })
  }

  setSearchTerm(event){
    const searchTerm = event.target.value
    this.setState({searchTerm})
  }

  close(){
    this.setState({
      searchTerm: '',
      result: [],
      modalDisplayed: false,
      focused: false
    })
  }

  onKeyDown(event) {
    if (event.key === "Escape") {
      this.close()
    }
  }

  onKeyUp(event){
    this.search(event)
  }

  search() {
    this.setState({loading: true})
    if (this.searchRequest) this.searchRequest.abort()

    this.searchRequest = commands.search(this.state.searchTerm)

    this.searchRequest.then(result => {
      this.setState({result, loading: false})
    })
  }

  onClick(){
    this.setState({modalDisplayed: true})
  }

  onSubmit(event) {
    event.preventDefault()
  }

  render(){
    const searchResultModal = this.state.modalDisplayed ?
      <SearchResultModal
        className="CardSearchForm-Result"
        onClose={this.close}
        searchTerm={this.state.searchTerm}
        result={this.state.result}
        loading={this.state.loading}
      /> :
      null
    const icon = this.state.focused ?
      <Icon type="times"  className="CardSearchForm-cancel-icon" /> :
      <Icon type="search" className="CardSearchForm-search-icon" />

    return <Form className="CardSearchForm" onSubmit={this.onSubmit} >
      <input
        type="text"
        onKeyDown={this.onKeyDown}
        className="CardSearchForm-Input"
        ref="content"
        value={this.state.searchTerm}
        onChange={this.setSearchTerm}
        onFocus={this.focus}
        onKeyUp={this.search.bind(this)}
        onClick={this.onClick}
      />
      {icon}
      {searchResultModal}
    </Form>
  }


}

class SearchResultModal extends Component {

  constructor(props) {
    super(props)
    this.closeIfUserClickedElsewhere = this.closeIfUserClickedElsewhere.bind(this)
    document.body.addEventListener("click", this.closeIfUserClickedElsewhere)
  }

  componentWillUnmount(){
    document.body.removeEventListener("click", this.closeIfUserClickedElsewhere)
  }

  closeIfUserClickedElsewhere(event){
    const container = ReactDOM.findDOMNode(this.refs.window)
    if (!container.contains(event.target) && container !== event.target) {
      this.props.onClose()
    }
  }

  render() {
    const { result, searchTerm, onClose } = this.props
    if (this.props.loading) {
      return <div className="CardSearchForm-Modal" >
        <div ref="window" className="CardSearchForm-Modal-window">
          <Link className="CardSearchForm-Modal-window-close" onClick={onClose}>
            <Icon type="times" />
          </Link>
          <div className="CardSearchForm-Modal-Loader">
            <h4 className="CardSearchForm-Modal-Loader-text">Searching...</h4>
            <Spinner />
          </div>
        </div>
      </div>
    }

    const cardNodes = result.map(card =>
      <Card
        key={card.id}
        card={card}
        editable={false}
        onClick={onClose}
      />
    )

    const searchDisplay = result.length === 0 ?
      <div className="CardSearchForm-Result-Message">
        <h5>No cards or boards were found matching your search</h5>
      </div> :
      <div className="CardSearchForm-Modal-window-results">
        {cardNodes}
      </div>

    return <div className="CardSearchForm-Modal" >
      <div ref="window" className="CardSearchForm-Modal-window">
        <h5 className="CardSearchForm-Result-Title">Card Search Results For: &quot;{this.props.searchTerm}&quot;</h5>
        <Link className="CardSearchForm-Modal-window-close" onClick={onClose}>
          <Icon type="times" />
        </Link>
        {searchDisplay}
      </div>
    </div>
  }
}
