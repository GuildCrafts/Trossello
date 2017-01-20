import React, { Component } from 'react'
import Link from '../../Link'
import Icon from '../../Icon'
import moment from 'moment'
import PopoverMenuButton from '../../PopoverMenuButton'
import DueDateLabelPopover from './DueDateLabelPopover'
import LabelSection from './LabelSection'
import ColorLabel from './ColorLabel'
import './DueDateLabel.sass'

export default class DueDateLabel extends Component {
  constructor(props){
    super(props)
    this.dueStatus = this.dueStatus.bind(this)
  }

  dueStatus() {
    const dueDate = moment(this.props.card.due_date)
    const pastDue = moment().isAfter(dueDate)
    const labelData = {
      preText: "",
      postText: "",
      color: "grey"
    }

    if (pastDue) {
      if (dueDate.isBefore(moment().subtract(1, "days"), "day")) {
        labelData.color = 'paleRed'
        labelData.preText = dueDate.format("MMM D [at] h:mm")
        labelData.postText = "(past due)"
      } else {
        labelData.color = 'red'
        labelData.preText = dueDate.calendar(moment(), "D hh:mm A");
        labelData.postText = "(recently past due)"
      }
    } else {
      if (dueDate.isAfter(moment().add(1, "days"), "day")) {
        labelData.color = 'grey'
        labelData.preText = dueDate.format("MMM D [at] h:mm")
      } else {
        labelData.color = 'orange'
        labelData.preText = dueDate.calendar(moment(), "D hh:mm A");
        labelData.postText = "(due soon)"
      }
    }
    if (this.props.card.complete){
      labelData.color = 'green'
      labelData.postText = ""
    }
    return labelData
  }

  render(){
    const { card, shownOn } = this.props
    const labelData = this.dueStatus()
    const className = `Card-DueDateLabel-small`

    if (shownOn === "front"){
      const shortDate = moment(card.due_date).format("MMM D")
      const dueDateContent= <div className={className}>
        <Icon
          type="clock-o"
          className="Card-DueDateLabel-Icon"
        />
        <span className="Card-DueDateLabel-text">{shortDate}</span>
      </div>

      return <ColorLabel
        className="Card-ColorLabel-smallDueDateLabel"
        color={labelData.color}
      >
        {dueDateContent}
      </ColorLabel>
    }

    let longDate = labelData.preText
    const dueDatePopover = <DueDateLabelPopover card={card}/>

    return <LabelSection heading="Due Date">
      <PopoverMenuButton
        key={card.id}
        type="unstyled"
        popover={dueDatePopover}
        className="Card-DueDateLabel-container"
      >
      <ColorLabel
        color={labelData.color}
      >
        {longDate + ' ' + labelData.postText}
      </ColorLabel>
      </PopoverMenuButton>
    </LabelSection>
  }
}
