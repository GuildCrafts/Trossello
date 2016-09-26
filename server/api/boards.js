import express from 'express'
const router = new express.Router

router.get( '/', ( request, response ) => {
  response.json( {
    id: 'lorem',
    name: 'lorem'
  } )
} )

router.get( '/:boardId', ( request, response ) => {
  response.json( {
    id: request.params.boardId,
    name: 'lorem'
  } )
}

export default router
