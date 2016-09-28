import express from 'express'
import {queries, commands} from '../database'

const router = new express.Router()

router.get('/', (request, response, next) => {
  queries.getUsers()
    .then(users => {
      response.json(users)
    })
    .catch(next)
})

router.post('/', (request, response, next) => {
  commands.createUser(request.body)
    .then(user => {
      response.json(user)
    })
    .catch(next)
})


router.get('/:userId', (request, response, next) => {
  queries.getUserById(request.params.userId)
    .then(user => {
      if (user){
        response.json(user)
      }else{
        response.status(404).json(null)
      }
    })
    .catch(next)
})


router.post('/:userId/delete', (request, response, next) => {
  commands.deleteUser(request.params.userId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

export default router
