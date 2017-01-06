import React from 'react'
import BadgeContainer from './BadgeContainer'
import PopoverMenuButton from '../../../PopoverMenuButton'
import CardLabel from './CardLabel'

const LabelsContainer = ({card, board, labelPanel}) => {
  const cardLabels = card.label_ids
    .map( labelId => board.labels.find(label => label.id === labelId))
    .map(label =>
      <PopoverMenuButton
        key={label.id}
        className="CardModal-CardBadges-labels-Label"
        type="unstyled"
        popover={labelPanel}
      >
        <CardLabel
          color={label.color}
          text={label.text}
          checked={false}
        />
      </PopoverMenuButton>
    )

  return <BadgeContainer heading="Labels">
    {cardLabels}
  </BadgeContainer>
}

export default LabelsContainer
