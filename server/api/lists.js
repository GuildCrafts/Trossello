import express from 'express'
import {queries, commands} from '../database'
const router = new express.Router()

// UPDATE
router.post('/:listId', (request, response, next) => {
  commands.updateList(request.params.listId, request.body)
    .then(list => {
      response.json(list)
    })
    .catch(next)
})

// DELETE
router.post('/:listId/delete', (request, response, next) => {
  commands.deleteList(request.params.listId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

export default router
