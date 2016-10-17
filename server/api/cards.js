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
router.post('/:cardId/delete', (request, response, next) => {
  commands.archiveCard(request.params.cardId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

export default router
