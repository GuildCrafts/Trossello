import express from 'express'
import {queries, commands} from '../database'
const router = new express.Router()
import uuid from 'uuid'
import sendEmail from '../mail/mailer'



router.post('/:boardId', (request, response, next) => {
  const email = request.body.email
  const { boardId } = request.params
  const token = uuid.v1()
  const attributes = {boardId: boardId, email: email, token: token}
  console.log('email', email);
  commands.createInvite(attributes)
    .then( result => {
      sendEmail( result )
    })
    .catch(next)
})

router.get('/verify/:token', (request, response, next) => {
  let {token} = request.params
  queries.verifyToken(token)
  .then(result => {
    console.log(request.session);
    let userId = request.session.userId
    if (result[0] === undefined) {
      response.redirect('/')
    } else if (result[0].token === token) {
      if(userId){
        let attributes = {board_id: result[0].boardId, user_id: userId}
        commands.createUserBoardEntry(attributes)
        .then(record =>
          response.redirect(`/boards/${record.board_id}`)
        )
      }else{
        request.session.inviteCookie = token
        request.session.redirectToAfterLogin = `/boards/${record.board_id}`
        console.log(request.session);
        response.redirect('/')
      }
    }
  })
})
export default router
