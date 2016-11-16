import express from 'express'
import {queries, commands} from '../database'
const router = new express.Router()

// UPDATE
router.post('/:listId', (request, response, next) => {
  commands.updateList(request.params.listId, request.body)
    .then(list => {
      if (list){
        response.json(list)
      }else{
        response.status(404).json(null)
      }
    })
    .catch(next)
})

// ARCHIVE
router.post('/:listId/archive', (request, response, next) => {
  commands.archiveList(request.params.listId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

//MOVE ALL CARDS
router.post('/cards/move', (request, response, next) => {
  const { cardsToMove, newList, orderOffset } = request.body

  commands.moveAllCards(cardsToMove, newList, orderOffset)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

export default router
