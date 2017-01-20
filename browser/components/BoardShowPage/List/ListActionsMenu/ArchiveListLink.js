import React, { Component } from 'react'
import Icon from '../../../Icon'
import Button from '../../../Button'
import ConfirmationLink from '../../../ConfirmationLink'
import commands from '../../../../commands'

export default class ArchiveListLink extends Component {
  static propTypes = {
    list: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props)
    this.archiveList = this.archiveList.bind(this)
  }

  archiveList(){
    commands.archiveList(this.props.list.id)
  }

  render(){
    return <ConfirmationLink
      onConfirm={this.archiveList}
      buttonName="Archive List"
      title="Archive List?"
      message="Are you sure you want to archive this list?"
    >
      Archive This List
    </ConfirmationLink>
  }
}
