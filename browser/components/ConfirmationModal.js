import React, { Component } from 'react'
import Link from '../Link'
import Icon from '../Icon'
import './ConfirmationModal.sass'
import ArchiveButton from './BoardShowPage/ArchiveButton'

export default class ConfirmationModal extends Component {
    constructor(props){
      super(props)
      this.state = {
        open: false,
        confirmThis: null
      }
    }


  render(){
    return <div className="ConfirmationModal">
      <h4>Confirm you want to {this.state.confirmThis}</h4>

      <ArchiveButton onClick={this.props.onClick} />

    </div>
  }






}
