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

// ARCHIVE
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

router.post('/:cardId/move', (request, response, next) => {
  let { boardId, listId, order } = request.body
  let { cardId } = request.params
  boardId = Number(boardId)
  cardId  = Number(cardId)
  listId  = Number(listId)
  order   = Number(order)
  commands.moveCard({ boardId, cardId, listId, order })
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

// UNARCHIVE
router.post('/:cardId/unarchive', (request, response, next) => {
  commands.unarchiveCard(request.params.cardId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

export default router
