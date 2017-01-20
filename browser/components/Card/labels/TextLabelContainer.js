import React from 'react'
import LabelSection from './LabelSection'
import TextLabel from './TextLabel'
import PopoverMenuButton from '../../PopoverMenuButton'

const TextLabelContainer = ({card, board, labelPanel}) => {
  const cardLabels = card.label_ids
    .map( labelId => board.labels.find(label => label.id === labelId))
    .map(label =>
      <PopoverMenuButton
        key={label.id}
        type="unstyled"
        popover={labelPanel}
      >
        <TextLabel
          className="BoardShowPage-CardModal-labels-labelButton"
          color={label.color}
          text={label.text}
          checked={false}
        />
      </PopoverMenuButton>
    )

  return <LabelSection heading="Labels">
    {cardLabels}
  </LabelSection>
}

export default TextLabelContainer
