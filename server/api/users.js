import express from 'express'
const router = new express.Router 

router.get('/', (request, response) => {
  response.send('users index api route')
})

export default router 
