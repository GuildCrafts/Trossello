import React, { Component } from 'react'
import ActionsMenuPane from '../../ActionsMenuPane'
import Link from '../../../Link'
import Icon from '../../../Icon'
import TextLabel from '../../../Card/labels/TextLabel'
import commands from '../../../../commands'

export default class MainLabelPanel extends Component {
  editLabel(labelId, event){
    event.preventDefault()
    this.props.editLabel(labelId)
    this.props.goToPane('Create Label Pane')()
  }


  addOrRemoveLabel(labelId, event) {
    event.preventDefault()
    commands.addOrRemoveLabel(this.props.card.id, labelId)
  }

  render() {
    const { card, board } = this.props
    const boardLabels = board.labels.map( label => {
      const checked = card.label_ids.includes(label.id)
      return <LabelRow
        key={label.id}
        checked={checked}
        label={label}
        onEdit={this.editLabel.bind(this, label.id)}
        onClick={this.addOrRemoveLabel.bind(this, label.id)}
      />
    })

    return <ActionsMenuPane
      heading="Labels"
      onClose={this.props.onClose}
      className="BoardShowPage-CardModal-LabelMenu-MainLabelPane"
    >
      <div className="BoardShowPage-CardModal-LabelMenu-labels">
        {boardLabels}
      </div>
      <div className="BoardShowPage-CardModal-LabelMenu-controls">
        <Link
          className="BoardShowPage-CardModal-LabelMenu-button"
          onClick={this.props.goToPane('Create Label Pane')}
        >
          Create Label
        </Link>
      </div>
    </ActionsMenuPane>
  }
}

const LabelRow = (props) => {
  const { label, onClick, onEdit, checked } = props

  return <div className="BoardShowPage-CardModal-LabelMenu-LabelRow">
    <div
      className="BoardShowPage-CardModal-LabelMenu-LabelRow-box"
      onClick={onClick}
    >
      <TextLabel
        className="BoardShowPage-CardModal-LabelMenu-LabelRow-label"
        key={label.id}
        color={label.color}
        text={label.text}
        checked={checked}
      />
    </div>
    <Link
      onClick={onEdit}
      className="BoardShowPage-CardModal-LabelMenu-LabelRow-edit"
    >
      <Icon type="pencil" />
    </Link>
  </div>
}
