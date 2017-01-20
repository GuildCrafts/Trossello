import React from 'react'
import Icon from '../../Icon'

const ExportBoardButton = (props) => {
  return <a
    className="BoardShowPage-MenuSideBar-PaneButton BoardShowPage-MenuSideBar-ExportBoardButton"
    href={`/api/boards/${props.boardId}?download=1`}
  >
    <Icon type='download' />
    Export Board
  </a>
}

export default ExportBoardButton
