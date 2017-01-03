import React, {Component} from 'react'
import $ from 'jquery'
import Link from '../../Link'
import Icon from '../../Icon'
import moment from 'moment'
import './Badge.sass'
import './CardModal.sass'
import PopoverMenuButton from '../../PopoverMenuButton'
import DueDatePopover from './DueDatePopover'

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
        status.postText = moment( dueDate ).fromNow()
      }
    } else {
      if (dueDate.isAfter(moment().add(1, 'days'), 'day')) {
        status.className = 'Badge-due-future-distant'
        status.preText = dueDate.format('MMM D [at] h:mm')
      } else {
        status.className = 'Badge-due-future-near'
        status.preText = dueDate.calendar(moment(), 'D hh:mm A');
        status.postText = moment( dueDate ).fromNow()
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
    let className = 'Badge-due ' + status.className
    let renderBadge

    if(shownOn === 'front'){
      let shortDate = moment(card.due_date).format('MMM D')
      renderBadge = <div className={className}><Icon type="clock-o"/><span>{shortDate}</span></div>
    } else {
      let longDate = status.preText
      const dueDatePopover = <DueDatePopover card={card}/>
      className += ' Badge-due-large'
      renderBadge = (
          <div className='CardModal-CardBadges'>
            <div className='CardModal-CardBadges-header'>Due Date</div>
            <PopoverMenuButton key={card.id} type='unstyled' popover={dueDatePopover} className='CardModal-CardBadges-labels-Label Badge-buttonHack'>
              <div className={className}><span>{longDate + ' ' + status.postText}</span></div>
            </PopoverMenuButton>
          </div>
      )
    }

    return renderBadge

  }

}
