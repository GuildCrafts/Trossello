import React from 'react'
import Link from '../../../../Link'
import DialogBox from '../../../../DialogBox'
import ActionsMenuPane from '../../../ActionsMenuPane'
import ArchiveListLink from '../ArchiveListLink'

const ListActionsPane = ({onClose, createCard, list, goToPane}) => {
  return <ActionsMenuPane
      className="BoardShowPage-List-ListActionsMenu-ListActionsPane"
      heading="List Actions"
      onClose={onClose}
    >
    <Link className="BoardShowPage-List-ListActionsMenu-ListActionsPane-AddCard" onClick={createCard}>Add a Card…</Link>
    <DialogBox.Divider />
    <Link className="BoardShowPage-List-ListActionsMenu-ListActionsPane-CopyList" onClick={goToPane('Copy List')}>Copy List…</Link>
    <Link className="BoardShowPage-List-ListActionsMenu-ListActionsPane-MoveList" onClick={goToPane('Move List')}>Move List…</Link>
    <Link>Subscribe</Link>
    <DialogBox.Divider />
    <Link className="BoardShowPage-List-ListActionsMenu-ListActionsPane-MoveAllCards" onClick={goToPane('Move All Cards')}>Move All Cards In This List…</Link>
    <Link className="BoardShowPage-List-ListActionsMenu-ListActionsPane-ArchiveAllCards" onClick={goToPane('Archive All Cards')}>Archive All Cards In This List…</Link>
    <DialogBox.Divider />
    <ArchiveListLink list={list} />
  </ActionsMenuPane>
}

export default ListActionsPane
