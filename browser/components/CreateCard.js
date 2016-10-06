import $ from 'jquery'
import './CreateCard.sass'
import React, { Component } from 'react'
import Link from './Link'

class CreateCard extends Component {

  render(){
    return this.state.expanded ?
      <NewCardForm /> :
      <NewCardLink onClick={this.expand}/>
  }
}

const NewCardLink = (props) => {
  return <Link {...props} >Add a card...</Link>
}

export default CreateCard
