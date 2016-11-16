import express from 'express'
import {queries, commands} from '../database'
const router = new express.Router()

// LOCK BOARDS DROPDOWN MENU
router.post('/:userId/lockdropdown', (request, response, next) => {
  commands.lockDropdown(request.params.userId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

// UNLOCK BOARDS DROPDOWN MENU
router.post('/:userId/unlockdropdown', (request, response, next) => {
  commands.unlockDropdown(request.params.userId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

export default router
