import React, { Component } from 'react'
import moment from 'moment'
import CardComment from './CardComment'
import Activity from '../Activity'
import Link from '../../Link'
import Icon from '../../Icon'
import './CardActivity.sass'

export default class CardActivity extends Component {
  static PropTypes = {
    board: React.PropTypes.object.isRequired,
    card: React.PropTypes.object.isRequired,
  }

  constructor(props){
    super(props)
    this.state = {
      showingActivity: true,
    }
    this.activityToggle = this.activityToggle.bind(this)
  }

  activityToggle(event){
    if (event) event.preventDefault()
    this.setState({showingActivity: !this.state.showingActivity})
  }

  render(){
    const {board, card} = this.props

    let activity = [].concat(card.comments)
    if (this.state.showingActivity)
      activity = activity.concat(
        board.activity.filter(activity => activity.card_id === card.id)
      )

    activity = activity
      .sort((a, b) => {
        a = moment(a.created_at).toDate()
        b = moment(b.created_at).toDate()
        return b - a
      })
      .map(item =>
        'metadata' in item ?
          <Activity
            key={item.id}
            className="BoardShowPage-CardModal-Activity"
            activity={item}
            users={board.users}
            board={board}
            cardActivity
          />
        :
          <CardComment
            key={item.id}
            users={board.users}
            comment={item}
          />
      )

    return <div className="BoardShowPage-CardModal-CardActivity">
      <div className="BoardShowPage-CardModal-CardActivity-header">
        <div className="BoardShowPage-CardModal-CardActivity-header-icon">
          <Icon size="2" type="list"/>
        </div>
        <div className="BoardShowPage-CardModal-CardActivity-header-title">Activity</div>
        <Link
          className="BoardShowPage-CardModal-CardActivity-header-toggle"
          onClick={this.activityToggle}
        >
          {this.state.showingActivity ? 'Hide Details' : 'Show Details'}
        </Link>
      </div>
      <div className="BoardShowPage-CardModal-CardActivity-activityLog">
        {activity}
      </div>
    </div>
  }
}
