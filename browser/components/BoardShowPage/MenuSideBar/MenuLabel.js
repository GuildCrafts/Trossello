import React, { Component, PropTypes } from 'react'
import Link from '../../Link'
import moment from 'moment'
import './MenuLabel.sass'
import Label from '../../Label.js'

export default class MenuLabel extends Component {
  static PropTypes = {
    board: React.PropTypes.object.isRequired,
    card: React.PropTypes.object.isRequired
  }

  const LabelMenuRow = (props) => {
    const {label, onClick, onEdit, checked} = props

    return <div className="CardLabel-LabelRow">
      <div className="CardLabel-LabelRow-box" onClick={onClick}>
        <Label key={label.id} color={label.color} text={label.text} checked={checked}/>
      </div>
      <Link onClick={onEdit} className="CardLabel-LabelRow-edit"><Icon type="pencil" /></Link>
    </div>
  }

  render(){
    const { card, board } = this.props
    const boardLabels = board.labels.map ( label => {
      const checked = card.label_ids.includes(label.id)
      return <LabelMenuRow
        key={label.id}
        checked={checked}
        label={label}
      />
    })
    return(
      <div className="MenuLabel-labels">
        {boardLabels}
      </div>
    )
  }
}
