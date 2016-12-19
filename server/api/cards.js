import express from 'express'
import {queries, commands} from '../database'

const router = new express.Router()


// UPDATE
router.post('/:cardId', (request, response, next) => {
  commands.updateCard(request.params.cardId, request.body)
    .then(card => {
      if (card){
        response.json(card)
      }else{
        response.status(404).json(null)
      }
    })
    .catch(next)
})

// ARCHIVE
router.post('/:cardId/archive', (request, response, next) => {
  commands.archiveCard(request.session.userId, request.params.cardId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

// UNARCHIVE
router.post('/:cardId/unarchive', (request, response, next) => {
  commands.unarchiveCard(request.session.userId, request.params.cardId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

// DELETE
router.post('/:cardId/delete', (request, response, next) => {
  const { cardId } = request.params
  queries.getCardById(cardId).then( card =>
    commands.deleteCard(
      request.session.userId,
      card.board_id,
      cardId
    )
  )
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

// MOVE
router.post('/:cardId/move', (request, response, next) => {
  let { boardId, listId, order } = request.body
  let { cardId } = request.params
  let { userId } = request.session
  boardId = Number(boardId)
  cardId  = Number(cardId)
  listId  = Number(listId)
  order   = Number(order)
  commands.moveCard(userId, { boardId, cardId, listId, order })
    .then(() => {
      response.json(null)
    })
    .catch(next)
})

//CREATE COMMENT
router.post('/:cardId/comments', (request, response, next) => {
  const {cardId} = request.params
  const {userId, content} = request.body

  commands.addComment(cardId, userId, content)
  .then(() => {
    response.json(null)
  })
  .catch(next)
})

//UPDATE COMMENT
router.post('/:cardId/comments/:commentId', (request, response, next) => {
  const {commentId} = request.params
  const {content} = request.body

  commands.updateComment(commentId, content)
  .then(() => {
    response.json(null)
  })
  .catch(next)
})

//DELETE COMMENT
router.post('/:cardId/comments/:commentId/delete', (request, response, next) => {
  const {commentId} = request.params

  commands.deleteComment(commentId)
  .then(() => {
    response.json(null)
  })
  .catch(next)

})

//ADD/REMOVE LABEL
router.post('/:cardId/labels/:labelId', (request, response, next) => {
  let {cardId, labelId} = request.params

  commands.addOrRemoveCardLabel(cardId, labelId)
  .then(() => {
    response.json(null)
  })
  .catch(next)

})

router.post('/:cardId/users/add', (request, response, next) => {
  const { boardId, targetId } = request.body
  const { cardId } = request.params
  const { userId } = request.session
  commands.addUserToCard(userId, boardId, cardId, targetId)
    .then( _ => {
      response.json(null)
    })
    .catch(next)
})

router.post('/:cardId/users/remove', (request, response, next) => {
  const { boardId, targetId } = request.body
  const { cardId } = request.params
  const { userId } = request.session
  commands.removeUserFromCard(userId, boardId, cardId, targetId)
    .then( _ => {
      response.json(null)
    })
    .catch(next)
})

export default router
