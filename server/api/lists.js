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

// ARCHIVE
router.post('/:listId/archive', (request, response, next) => {
  commands.archiveList(request.params.listId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})
// UNARCHIVE
router.post('/:listId/unarchive', (request, response, next) => {
  commands.unarchiveList(request.params.listId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

export default router
