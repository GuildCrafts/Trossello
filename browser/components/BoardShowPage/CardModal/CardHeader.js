import React from 'react'
import CardName from './CardName'
import Icon from '../../Icon'
import './CardHeader.sass'

const CardHeader = ({card, list}) => {
  return <div className="BoardShowPage-CardModal-CardHeader">
    <div className="BoardShowPage-CardModal-CardHeader-title">
      <div className="BoardShowPage-CardModal-CardHeader-title-icon">
        <Icon type="window-maximize" size='1'/>
      </div>
      <div className="BoardShowPage-CardModal-CardHeader-title-text">
        <CardName card={card} />
      </div>
    </div>
    <div className="BoardShowPage-CardModal-CardHeader-list">
        in list <span className="BoardShowPage-CardModal-CardHeader-list-name">
          {list.name}
        </span>
    </div>
  </div>
}

export default CardHeader
