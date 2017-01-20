import React, { Component } from 'react'
import boardStore from '../../../../stores/boardStore'
import TextLabel from '../../../Card/labels/TextLabel'
import ColorBoxGroup from '../../../ColorBoxGroup'
import Link from '../../../Link'
import Form from '../../../Form'
import Icon from '../../../Icon'
import Button from '../../../Button'
import ConfirmationButton from '../../../ConfirmationButton'
import ActionsMenu from '../../ActionsMenu'
import ActionsMenuPane from '../../ActionsMenuPane'
import CreateLabelPanel from './CreateLabelPanel'
import MainLabelPanel from './MainLabelPanel'
import commands from '../../../../commands'
import './index.sass'

export default class LabelMenu extends Component {

  static propTypes = {
    card: React.PropTypes.object.isRequired,
    board: React.PropTypes.object.isRequired,
    // onClose: React.PropTypes.func.isRequired
  }

  constructor(props){
    super(props)
    this.state = {
      editingLabel: null
    }
    this.editLabel = this.editLabel.bind(this)
  }

  editLabel(labelId){
    this.setState({editingLabel: labelId})
  }

  render(){
    const { card, board, onClose } = this.props
    return <ActionsMenu
      className="BoardShowPage-CardModal-LabelMenu"
      defaultPane="Main Label Pane"
      paneProps={{
        state: this.state,
        onClose: this.props.onClose,
        card: this.props.card,
        board: this.props.board,
        editLabel: this.editLabel,
      }}
      panes={{
        "Main Label Pane": MainLabelPanel,
        "Create Label Pane": CreateLabelPanel,
      }}
    />
  }
}
