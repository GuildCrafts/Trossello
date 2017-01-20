import React from 'react'
import Pane from './Pane'
import ArchivedItems from './ArchivedItems'

const UnarchivePane = ({board, onClose, gotoPane, goBack}) =>
  <Pane name="Labels">
    <ArchivedItems board={board} />
  </Pane>

export default UnarchivePane
