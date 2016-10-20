import React, { Component } from 'react'
import './CardSearchForm.sass'
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
        searching: false,
        searchTerm: null,
        result: null
    }
    this.onKeyUp=this.onKeyUp.bind(this)
    this.sendSearch=this.sendSearch.bind(this)
    this.saveSearch=this.saveSearch.bind(this)
    this.closeSearchModal = this.closeSearchModal.bind(this)
  }



  closeSearchModal(){
      this.setState({
        searching:false,
        searchTerm: null,
        result:null
      })
      this.refs.content.value=''
    }


  onKeyUp(event) {
    if (!event.shiftKey && event.keyCode === 13) {
      event.preventDefault()
      this.sendSearch(event)
    }
    if (event.keyCode === 27) {
      event.preventDefault()
      this.cancel()
    }
  }

  sendSearch(event) {
    event.preventDefault()
    const content='%'+this.refs.content.value.replace(/\n/,'').toLowerCase()+'%'
    $.ajax({
      method:"POST",
      url: `/api/boards/search`,
      contentType:"application/json; charset=utf-8",
      dataType:"json",
      data:JSON.stringify({content: content}),
    })
    .then(result => {
      this.saveSearch(result)
      this.setState({
        searching: true,
        searchTerm: this.refs.content.value.replace(/\n/,'')
      })
    })
    .then(() => {
      boardStore.reload()
    })
    .catch(error => {
      console.error(error)
    })
  }
  saveSearch(result) {
    this.setState({
      result: result
    })
  }

  render(){
    const searchResultModal = this.state.searching ?
    <SearchResultModal className="CardSearchForm-Result" onClose={this.closeSearchModal} searchTerm={this.state.searchTerm} result={this.state.result} /> : null

    return <Form className="CardSearchForm-Form" onSubmit={this.sendSearch} >
    <textarea
      onKeyUp={this.onKeyUp}
      className="CardSearchForm-Input"
      ref="content"
    />
    {searchResultModal}
    </Form>
  }


}

class SearchResultModal extends Component {
  render() {
    const { result, searchTerm, onClose } = this.props
    const cardNodes = result.map(card => {
      return <Card
        key={card.id}
        card={card}
      />
    })
  return <div className="CardSearchForm-Modal">
    <div ref="shroud" className="CardSearchForm-Modal-shroud">
      <div ref="window" className="CardSearchForm-Modal-window">
        <h5 className="CardSearchForm-Result-Title">Card Search Results For: &quot;{this.props.searchTerm}&quot;</h5>
        <Link className="CardSearchForm-Result-Close" onClick={this.props.onClose}>
          <Icon type="times" />
        </Link>
        {cardNodes}
      </div>
    </div>
  </div>

  }
}
