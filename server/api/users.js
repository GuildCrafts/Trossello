import express from 'express'
const router = new express.Router()

router.get('/', (request, response) => {
  response.json({
    1: {
      id: 42,
      email: "me@me.com",
      password: "123"
    },
    2: {
      id: 43,
      email: "you@you.com",
      password: "123"
    }
  })
})

router.post('/', (request, response) => {
  response.send('Create User API path')
})

router.get('/:userId', (request, response) => {
  response.json({
    id: request.params.userId,
    email: "me@me.com",
    password: "123"
  })
})

export default router 
