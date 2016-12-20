import express from 'express'
import {queries, commands} from '../database'
const router = new express.Router()


router.post('/:boardId', (request, response, next) => {
  const email = request.body.email
  const { boardId } = request.params
  const { userId } = request.session
  const attributes = {boardId: boardId, email: email}
  commands.createInvite(userId, attributes)
    .then( result => {
      return response.json(result)
    })
    .catch( error => {
      if( error.message.includes('duplicate key value violates unique constraint')){
        error.status = 409
      }
      next(error)
    })
})

router.get('/verify/:token', (request, response, next) => {
  let {token} = request.params
  let  {userId} = request.session
  queries.getInviteByToken(token).then(invite =>{
    let boardId = invite.boardId
    let boardURL = `/boards/${boardId}`
    if ( !request.session.userId ){
      request.session.invited = true
      request.session.redirectToAfterLogin = `/api/invites/verify/${token}`
      response.redirect('/login_via_github')
    } else if (invite.token === token) {
      commands.addUserToBoard(userId, boardId)
      .then( data => {
        response.redirect(boardURL)
      })
    } else {
      response.redirect('/')
    }
  })
})
export default router
