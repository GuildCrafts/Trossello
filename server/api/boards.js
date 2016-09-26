import express from 'express'
const router = new express.Router

router.get( '/', ( request, response ) => {
  response.json( {
    id: 'lorem',
    name: 'lorem'
  } )
} )

export default router
