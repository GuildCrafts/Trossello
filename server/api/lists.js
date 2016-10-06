import express from 'express'
import {queries, commands} from '../database'
const router = new express.Router()

router.get( '/', ( request, response ) => {
  response.json( {
    id: 'lorem',
    board_id: 'lorem',
    name: 'lorem'
  } )
} )

router.get( '/:listId', ( request, response ) => {
  response.json( {
    id: request.params.listId,
    board_id: 'lorem',
    name: 'lorem'
  } )
} )

router.post( '/:listId/delete', (request, response, next) => {
  commands.deleteList(request.params.listId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

export default router
