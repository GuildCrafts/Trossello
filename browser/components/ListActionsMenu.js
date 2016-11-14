import React, {Component} from 'react'
import $ from 'jquery'
import './ListActionsMenu.sass'
import Link from './Link'
import DialogBox from './DialogBox'
import ConfirmationLink from './ConfirmationLink'

export default class ListActionsMenu extends Component {

  static propTypes = {
    list: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props)
    this.createCardTop = this.createCardTop.bind(this)
  }

  createCardTop(event){
    this.props.onCreateCardTop()
    this.props.onClose()
    //This looks like a good place to start
  }

  render(){
    const { list } = this.props
    return <DialogBox className="ListActionsMenu" heading="List Actions" onClose={this.props.onClose}>
      <div className="ListActionsMenu-content">
        <Link onClick={this.createCardTop}>Add a Card…</Link>
        <DialogBox.Divider />
        <Link>Copy List…</Link>
        <Link>Move List…</Link>
        <Link>Subscribe</Link>
        <DialogBox.Divider />
        <Link>Move All Cards In This List…</Link>
        <Link>Archive All Cards In This List…</Link>
        <DialogBox.Divider />
        <ArchiveListLink list={list} />
      </div>
    </DialogBox>
  }
}

class ArchiveListLink extends Component {

  static propTypes = {
    list: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props)
    this.archiveList = this.archiveList.bind(this)
  }

  archiveList(){
    $.ajax({
      method: "POST",
      url: `/api/lists/${this.props.list.id}/archive`
    }).then(() => {
      boardStore.reload()
    })
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
