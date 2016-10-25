import express from 'express'
import {queries, commands} from '../database'

const router = new express.Router()


// UPDATE
router.post('/:cardId', (request, response, next) => {
  commands.updateCard(request.params.cardId, request.body)
    .then(card => {
      if (card){
        response.json(card)
      }else{
        response.status(404).json(null)
      }
    })
    .catch(next)
})

// DELETE
router.post('/:cardId/archive', (request, response, next) => {
  commands.archiveCard(request.params.cardId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

// MOVE
router.post('/:cardId/archive', (request, response, next) => {
  commands.archiveCard(request.params.cardId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

router.post('/:cardId/move', (request, response, next) =>{
  const {board_id, list_id, order} = request.body
  console.log("body", request.body);
  const cardId = request.params.cardId
  let card_id = cardId
  commands.moveCard({board_id, list_id, card_id, order})
  .then((card) => {
    
    response.json(card)
  })
  .catch( next)
})

export default router
