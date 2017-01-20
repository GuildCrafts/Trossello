import React, { Component } from 'react'
import Link from '../../../Link'
import Activity from '../../Activity'
import './BoardActivity.sass'

class BoardActivity extends Component {

  static PropTypes = {
    board: React.PropTypes.object.isRequired
  }

  render() {
    const activities = this.props.board.activity.map(activity =>
      <Activity key={activity.id} activity={activity} users={this.props.board.users} board={this.props.board}/>
    )
    const className =
      `BoardShowPage-MenuSideBar-BoardActivity ${this.props.className||''}`

    return <div className={className}>
      {activities}
    </div>
  }
}

const MainPaneActivity = props => {
  const { board, openPanel } = props
  const recentActivity = board.activity.slice(0, 15).map( activity =>
    <Activity
      key={activity.id}
      activity={activity}
      users={board.users}
      board={board}
    />
  )
  return <div className='BoardShowPage-MenuSideBar-BoardActivity'>
    {recentActivity}
    <Link
      onClick={openPanel}
      className='BoardShowPage-MenuSideBar-BoardActivity-viewLink'
    >
    View all activity...
    </Link>
  </div>
}

export { BoardActivity, MainPaneActivity }
