import express from 'express'
const router = new express.Router()


router.get('/', (request, response) => {
  response.json({
    1: {
      id: 1,
      board_id: 1,
      list_id: 1,
      content: 'something to do #1'
    },
    2: {
      id: 2,
      board_id: 2,
      list_id: 2,
      content: 'something to do #2'
    } 
  })
})

router.get('/:cardId', (request, response) => {
  response.json({
    id: request.params.cardId,
    board_id: 1,
    list_id: 1,
    content: 'something to do #1'
  })
})

export default router
