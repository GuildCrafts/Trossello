import express from 'express'
import {queries, commands} from '../database'
const router = new express.Router()
import uuid from 'uuid'


router.post('/:boardId', (request, response, next) => {
  const email = request.body.email
  const { boardId } = request.params
  const token = uuid.v1()
  const attributes = {boardId: boardId, email: email, token: token}
  console.log('email', email);
  commands.createInvite(attributes)
    .then( result => {
      response.send('this is an invite confirmation')
    })
    .catch(next)
})

export default router
