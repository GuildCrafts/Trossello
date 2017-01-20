import React from 'react'
import './CardModalShroud.sass'

const CardModalShroud = ({onClose, children}) => {
  return <div className="BoardShowPage-CardModal-CardModalShroud-container">
    <div onClick={onClose} className="BoardShowPage-CardModal-CardModalShroud-shroud"></div>
    <div className="BoardShowPage-CardModal-CardModalShroud-stage">
      <div className="BoardShowPage-CardModal-CardModalShroud-window">
        {children}
      </div>
    </div>
  </div>
}

export default CardModalShroud
