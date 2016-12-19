import React, {Component} from 'react'
import Link from '../../Link'
import Icon from '../../Icon'
import moment from 'moment'
import PopoverMenuButton from '../../PopoverMenuButton'
import DueDatePopover from './DueDatePopover'
import './Badge.sass'

export default class Badge extends Component {
  constructor(props){
    super(props)
    this.dueStatus = this.dueStatus.bind(this)
  }

  dueStatus() {
    const dueDate = moment(this.props.card.due_date)
    const pastDue = moment().isAfter(dueDate)
    const status = {
      className: '',
      preText: '',
      postText: ''
    }

    if (pastDue) {
      if (dueDate.isBefore(moment().subtract(1, 'days'), 'day')) {
        status.className = 'Badge-due-past-long'
        status.preText = dueDate.format('MMM D [at] h:mm')
        status.postText = '(past due)'
      } else {
        status.className = 'Badge-due-past-recent'
        status.preText = dueDate.calendar(moment(), 'D hh:mm A');
        status.postText = '(recently past due)'
      }
    } else {
      if (dueDate.isAfter(moment().add(1, 'days'), 'day')) {
        status.className = 'Badge-due-future-distant'
        status.preText = dueDate.format('MMM D [at] h:mm')
      } else {
        status.className = 'Badge-due-future-near'
        status.preText = dueDate.calendar(moment(), 'D hh:mm A');
        status.postText = '(due soon)'
      }
    }
    if (this.props.card.complete){
      status.className = 'Badge-due-complete'
      status.postText = ''
    }
    return status
  }

  render(){
    const { card, shownOn } = this.props
    let status = this.dueStatus()
    let className = `Badge-due ${status.className || ''}`
    let renderBadge

    if (shownOn === 'front'){
      let shortDate = moment(card.due_date).format('MMM D')
      return <div className={className}><Icon type="clock-o" className="Badge-due-dueIcon"/><span className="Badge-due-dueText">{shortDate}</span></div>
    }
    let longDate = status.preText
    const dueDatePopover = <DueDatePopover card={card}/>
    className += ' Badge-due-large'
    return <div className='Badge'>
        <div className='Badge-header'>Due Date</div>
        <PopoverMenuButton key={card.id} type='unstyled' popover={dueDatePopover} className='Badges-labels-Label Badge-buttonHack'>
          <div className={className}><span className="Badge-due-dueText">{longDate + ' ' + status.postText}</span></div>
        </PopoverMenuButton>
      </div>
  }
}
