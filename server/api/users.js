import express from 'express'
import {queries, commands} from '../database'

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

router.post('/', (request, response, next) => {
  commands.createUser(request.body)
    .then(() => {
      response.status(200).json({})
    })
    .catch(next)
})


router.get('/:userId', (request, response, next) => {
  queries.getUserById(request.params.userId)
    .then(user => {
      response.json(user)
    })
    .catch(next)
})

router.post('/:userId', (request, response, next) => {
  commands.deleteUser(request.params.userId)
    .then(() => {
      response.status(200).json({})
    })
    .catch(next)
})

export default router


