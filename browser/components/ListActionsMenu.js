import React, {Component} from 'react'
import $ from 'jquery'
import './ListActionsMenu.sass'
import Link from './Link'
import DialogBox from './DialogBox'
import ConfirmationLink from './ConfirmationLink'

class ListActionsMenu extends Component {

  static propTypes = {
    list: React.PropTypes.object.isRequired
  }

  constructor(props){
    super(props)
    this.createCard = this.createCard.bind(this)
  }

  createCard(event){
    this.props.onCreateCard()
    this.props.onClose()
  }

  render(){
    const { list } = this.props
    return <DialogBox className="ListActionsMenu" heading="List Actions" onClose={this.props.onClose}>
      <Link onClick={this.createCard}>Add a Card…</Link>
      <DialogBox.Divider />
      <Link>Copy List…</Link>
      <Link>Move List…</Link>
      <Link>Subscribe</Link>
      <DialogBox.Divider />
      <Link>Move All Cards In This List…</Link>
      <ArchiveAllCardsInListLink list={list}/>
      <DialogBox.Divider />
      <ArchiveListLink list={list} />
    </DialogBox>
  }
}

export default ListActionsMenu

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

class ArchiveAllCardsInListLink extends Component {

  constructor(props){
    super(props)
    this.archiveCardsInList = this.archiveCardsInList.bind(this)
  }

  archiveCardsInList(){
    $.ajax({
      method: "POST",
      url: `/api/lists/${this.props.list.id}/archivecards`
    }).then(() => {
      boardStore.reload()
    })
  }

  render(){
    return <ConfirmationLink
      onConfirm={this.archiveCardsInList}
      buttonName="Archive All"
      title="Archive All Cards in this List?"
      message="This will remove all the cards in this list from the board. To view archived cards and bring them back to the board, click “Menu” > “Archived Items.”"
    >
      Archive All Cards In This List…
    </ConfirmationLink>
  }
}
