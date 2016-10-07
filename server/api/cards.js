import express from 'express'
import {queries, commands} from '../database'

const router = new express.Router()

router.post('/', (request, response, next) => {
  commands.createCard(request.body)
    .then(card => {
      response.json(card)
    })
    .catch(next)
})

router.get('/:cardId', (request, response, next) => {
  queries.getCardById(request.params.cardId)
    .then(card => {
      if (card){
        response.json(card)
      }else{
        response.status(404).json(null)
      }
    })
    .catch(next)
})

router.post('/:cardId/delete', (request, response, next) => {
  commands.deleteCard(request.params.cardId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

router.post('/:cardId', (request, response, next) => {
  commands.updateCard(request.params.cardId, request.body)
    .then(cardId => {
        response.json(cardId)
    }).catch(next)
})

export default router
