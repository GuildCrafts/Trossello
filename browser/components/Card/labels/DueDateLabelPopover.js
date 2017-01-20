import React, {Component} from 'react'
import Form from '../../Form'
import Button from '../../Button'
import DialogBox from '../../DialogBox'
import FlexRowContainer from '../../FlexRowContainer'
import commands from '../../../commands'
import moment from 'moment'
import './DueDateLabelPopover.sass'

export default class DueDateLabelPopover extends Component {
  constructor(props){
    super(props)
    this.dateOnChange = this.dateOnChange.bind(this)
    this.dateOnBlur = this.dateOnBlur.bind(this)
    this.timeOnChange = this.timeOnChange.bind(this)
    this.timeOnBlur = this.timeOnBlur.bind(this)
    this.addDueDate = this.addDueDate.bind(this)
    this.removeDueDate = this.removeDueDate.bind(this)

    this.state = this.initialState()
  }

  defaultDueDate(){
    return moment().endOf('day').add(12, 'hours').add(1, 'minutes')
  }

  initialDueDate(){
    return this.props.card.due_date
      ? moment(this.props.card.due_date)
      : this.defaultDueDate()
    }

  dueDateToState(due_date){
    return {
      date: due_date.format('MM/DD/YYYY'),
      time: due_date.format('hh:mm a'),
    }
  }

  initialState(){
    return this.dueDateToState(this.initialDueDate())
  }

  validateCurrentDueDate(){
    const { date, time } = this.state
    let due_date = moment(`${date} ${time}`)
    return due_date.isValid() ? due_date : this.initialDueDate()
  }

  setValidDueDate(){
    this.setState(this.dueDateToState(this.validateCurrentDueDate()))
  }

  addDueDate(event){
    event.preventDefault()
    this.updateCardDueDate( this.validateCurrentDueDate() )
  }

  removeDueDate(event){
    event.preventDefault()
    this.updateCardDueDate( null )
  }

  updateCardDueDate( due_date ){
    commands.updateCard( this.props.card.id, { due_date } )
    .then( () => {
      boardStore.reload()
      this.props.onClose()
    })
  }

  dateOnChange(event){
    this.setState({date: event.target.value})
  }

  dateOnBlur(event){
    this.setValidDueDate()
  }

  timeOnChange(event){
    this.setState({time: event.target.value})
  }

  timeOnBlur(event){
    this.setValidDueDate()
  }

  render (){
    return <DialogBox heading='Change Due Date' onClose={this.props.onClose}>
      <Form onSubmit={this.addDueDate} name='add'>
        <FlexRowContainer>
          <label className="Card-DueDateLabelPopover-labelSpacer">Date<input type='text' className="DialogBox-inputText" value={this.state.date} onChange={this.dateOnChange} onBlur={this.dateOnBlur}></input></label>
          <label className="Card-DueDateLabelPopover-labelSpacer">Time<input type='text' className="DialogBox-inputText" value={this.state.time} onChange={this.timeOnChange} onBlur={this.timeOnBlur}></input></label>
        </FlexRowContainer>
        <p>There will be a calendar and such here.  Perhaps its own component?</p>
        <FlexRowContainer>
          <Button type='primary' submit>Save</Button>
        </FlexRowContainer>
      </Form>
      <Form className='Card-DueDateLabelPopover-relocateButton' onSubmit={this.removeDueDate} name='delete'>
        <Button submit type='danger'>Remove</Button>
      </Form>
    </DialogBox>
  }
}
