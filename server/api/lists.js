import express from 'express'
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

export default router
