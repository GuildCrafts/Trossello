import React from 'react'
import Card from '../Card'
import StyleExample from './StyleExample'

const CardSection = (props) => {
  const user = {
    id: 4,
    email: null,
    created_at: null,
    updated_at: null,
    github_id: 19511039,
    name: "Amelia",
    avatar_url: "https://thumbs.dreamstime.com/t/android-robot-thumb-up-22927887.jpg",
    boards_dropdown_lock: false,
  }
  const card = {
    id: 2,
    user_ids: [ 4 ],
    label_ids: [],
    board_id: 2,
    list_id: 4,
    content: "Create Style Guide",
  }
  const list = {
    id: 10,
    board_id: 4,
    name: "list",
    archived: false,
    order: 0,
    created_at: "2017-01-18T23:04:01.666Z",
    updated_at: "2017-01-18T23:04:01.666Z",
  }
  const board = {
    id:2,
    name: "Board1",
    background_color:	"orange",
    archived: false,
    starred:	false,
    created_at: null,
    updated_at: null,
    labels: [],
    lists: [ list ],
    cards:[ card ],
    users: [ user ],
  }

  return <StyleExample header="Cards" sourceCode='<Card editable archivable card={{id: 2, board: 2, list_id: 4}}></Card>'>
    <Card editable archivable user={user} board={board} card={card}/>
  </StyleExample>
}

export default CardSection
