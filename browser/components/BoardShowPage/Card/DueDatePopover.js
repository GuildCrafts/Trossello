import React, {Component} from 'react'
import Form from '../../Form'
import Button from '../../Button'
import DialogBox from '../../DialogBox'
import commands from '../../../commands'
import moment from 'moment'

export default class DueDatePopover extends Component {
  constructor(props){
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.dateOnChange = this.dateOnChange.bind(this)
    this.dateOnBlur = this.dateOnBlur.bind(this)
    this.timeOnChange = this.timeOnChange.bind(this)
    this.timeOnBlur = this.timeOnBlur.bind(this)

    let { date, time } = this.getDueDate()
    this.state = {
      date: date,
      time: time
    }
  }

  getDueDate(){
    let date, time
    if (this.props.card.due_date) {
      let currentDueDate = moment(this.props.card.due_date)
      date = currentDueDate.format('MM/DD/YYYY')
      time = currentDueDate.format('hh:mm a')
    } else {
      date = moment().add(1, 'days').format('MM/DD/YYYY')
      time = '12:00 pm'
    }
    return { date, time }
  }

  onSubmit(event){
    event.preventDefault()
    if ( moment(this.state.time, 'hh:mm a').isValid() && moment( this.state.date ).isValid() ){
      let newDueDate = event.target.name === 'add'
        ? { due_date: `${this.state.date} ${this.state.time}` }
        : { due_date: null }
      commands.updateCard( this.props.card.id, newDueDate )
      .then( () => {
        boardStore.reload()
        this.props.onClose()
        })
    } else return
  }

  dateOnChange(event){
      this.setState({date: event.target.value})
  }

  dateOnBlur(event){
    if (!moment(this.state.date).isValid()) {
      const { date } = this.getDueDate()
      this.setState({ date: date })
    }
  }

  timeOnChange(event){
    this.setState({time: event.target.value})
  }

  timeOnBlur(event){
    if (!moment(this.state.time, 'hh:mm a').isValid()) {
      const { time } = this.getDueDate()
      this.setState({ time: time })
    } else {
      this.setState({
        time: moment(this.state.time, ['hh:mm a']).format('hh:mm a')
      })

    }
  }

  render (){
    return <DialogBox className="CardModal-CopyCardDialog dueDate" heading='Change Due Date' onClose={this.props.onClose}>
      <Form action='add' onSubmit={this.onSubmit} name='add'>
        <div className="CardModal-CopyCardDialog-FlexRow">
          <label>Date<input type='text' value={this.state.date} onChange={this.dateOnChange} onBlur={this.dateOnBlur}></input></label>
          <label>Time<input type='text' value={this.state.time} onChange={this.timeOnChange} onBlur={this.timeOnBlur}></input></label>
        </div>
        <p>There will be a calendar and such here.  Perhaps its own component?</p>
        <div className="CardModal-CopyCardDialog-FlexRow">
          <Button type='primary' submit>Save</Button>
        </div>
      </Form>
      <Form action='remove' onSubmit={this.onSubmit} name='delete'>
        <Button submit type='danger'>Remove</Button>
      </Form>
    </DialogBox>
  }
}
