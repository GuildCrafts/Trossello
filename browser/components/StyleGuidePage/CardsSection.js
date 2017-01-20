import React from 'react'
import Card from '../Card'
import StyleExample from './StyleExample'

const CardsSection = (props) => {
  const card = {
    id: 2,
    user_ids: [1,2],
    board_id: 2,
    list_id: 4,
    content: "Create Style Guide"
  }
  return <div>
    <h3>Cards</h3>
    <StyleExample sourceCode='<Card editable archivable card={{id: 2, board: 2, list_id: 4}}></Card>'>
      <Card editable archivable card={card}/>
    </StyleExample>
  </div>
}

export default CardsSection
