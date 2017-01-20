import React from 'react'
import Pane from './Pane'
import { BoardActivity } from './BoardActivity'

const ActivityPane = ({board, onClose, gotoPane, goBack}) =>
  <Pane name="Activity">
    <BoardActivity board={board}/>
  </Pane>

export default ActivityPane
