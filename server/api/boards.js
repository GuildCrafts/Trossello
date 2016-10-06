import express from 'express'
import {queries, commands} from '../database'
const router = new express.Router()

router.get( '/', ( request, response, next) => {
  queries.getBoardsByUserId(request.session.userId).then(boards => {
    response.json(boards)
  }).catch(next)
} )

router.post( '/', (request, response, next) => {
  commands.createBoard(request.session.userId, request.body).then( board => {
    response.json(board)
  }).catch(next)
})

router.get( '/:boardId', ( request, response, next ) => {
  queries.getBoardById(request.params.boardId).then( board => {
    if (board){
      response.json(board)
    }else{
      response.status(404).json(null)
    }
  })
  .catch(next)
})

router.post( '/:boardId', ( request, response, next ) => {
  commands.updateBoard(request.params.boardId, request.body)
  .then(boardId => {
      response.json(boardId)
  }).catch(next)
})

router.post( '/:boardId/delete', ( request, response, next ) => {
  const boardId = request.params.boardId
  commands.deleteBoard(boardId).then( numberOfDeletions => {
    if (numberOfDeletions > 0) {
      response.status(200).json(null)
    }else{
      response.status(404).json(null)
    }
  }).catch(next)
})


// CREATE CARD
router.post('/:boardId/lists/:listId/cards', (request, response, next) => {
  const card = request.body
  const { boardId, listId } = request.params
  card.board_id = boardId
  card.list_id = listId
  commands.createCard(card)
    .then( card => {
      response.json(card)
    })
    .catch(next)
})

export default router
