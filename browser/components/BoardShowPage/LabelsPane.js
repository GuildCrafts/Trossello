import React, { Component, PropTypes } from 'react'
import CardLabel from './Card/CardBadges/CardLabel'


// This component is designed to be given to ActionsMenu
export default class LabelsPane extends Component {

  static propTypes = {
    board: PropTypes.object.isRequired,
  }

  render(){
    const { board } = this.props

    const labels = board.labels.map( label => {
      return <Label key={label.id} label={label} />
    })

    return <div className="LabelsPane">
      {labels}
    </div>
  }

}


const Label = ({label}) =>
  <div className="LabelsPane-Label">
    <CardLabel key={label.id} color={label.color} text={label.text} checked={false}/>
  </div>
