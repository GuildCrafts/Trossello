import React from 'react'
import Pane from './Pane'
import ChangeBackground from './ChangeBackground'

const ChangeBackgroundPane = ({board, onClose, gotoPane, goBack}) =>
  <Pane name="ChangeBackground">
    <ChangeBackground
      board={board}
    />
  </Pane>

export default ChangeBackgroundPane
