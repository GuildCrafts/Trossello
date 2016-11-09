import express from 'express'
import {queries, commands} from '../database'
const router = new express.Router()

// MOVE
router.post('/move', (request, response, next) => {
  commands.reorderLists(request.body)
  .then(() => {
    response.json(null)
  })
  .catch(next)
})

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

// DELETE
router.post('/:listId/archive', (request, response, next) => {
  commands.archiveList(request.params.listId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

export default router
