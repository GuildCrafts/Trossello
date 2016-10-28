import express from 'express'
import {queries, commands} from '../database'
const router = new express.Router()

// INDEX
router.get('/', (request, response, next) => {
  queries.getBoardsByUserId(request.session.userId).then(boards => {
    response.json(boards)
  }).catch(next)
} )

//SEARCH
router.post('/search', ( request, response, next ) => {
  const userId  = request.session.userId
  commands.searchQuery(userId, request.body.searchTerm)
    .then( result => {
      response.json(result)
    })
    .catch(next)
})

// CREATE
router.post('/', (request, response, next) => {
  commands.createBoard(request.session.userId, request.body).then( board => {
    response.json(board)
  }).catch(next)
})

// SHOW
router.get('/:boardId', (request, response, next ) => {
  const {boardId} = request.params
  queries.getBoardById(boardId).then( board => {
    if (board){
      if(request.query.download === '1'){
        response.attachment(`board${boardId}.json`)
      }
      response.json(board)
    }else{
      response.status(404).json(null)
    }
  })
  .catch(next)
})

// UPDATE
router.post('/:boardId', (request, response, next) => {
  commands.updateBoard(request.params.boardId, request.body)
  .then(boardId => {
      response.json(boardId)
  }).catch(next)
})

// DELETE
router.post('/:boardId/archive', (request, response, next) => {
  const boardId = request.params.boardId
  commands.archiveBoard(boardId).then( numberOfDeletions => {
    if (numberOfDeletions > 0) {
      response.status(200).json(null)
    }else{
      response.status(404).json(null)
    }
  }).catch(next)
})

// CREATE LIST
router.post('/:boardId/lists', (request, response, next) => {
  const list = request.body
  const { boardId } = request.params
  list.board_id = boardId
  commands.createList(list)
    .then( list => {
      response.json(list)
    })
    .catch(next)
})

// CREATE CARD
router.post('/:boardId/lists/:listId/cards', (request, response, next) => {
  const card = request.body
  console.log('card-?',card)
  const { boardId, listId } = request.params
  card.board_id = boardId
  card.list_id = listId
  console.log('card2-?',card)
  commands.createCard(card)
    .then( card => {
      response.json(card)
    })
    .catch(next)
})

// EDIT CARD
router.post('/:boardId/lists/:listId/cards/edit', (request, response, next) => {
  const card = request.body
  const { boardId, listId } = request.params
  card.board_id = boardId
  card.list_id = listId
  commands.updateCard(card)
    .then( card => {
      response.json(card)
    })
    .catch(next)
})

// LEAVE BOARD
router.post('/:boardId/leave', (request, response, next) => {
  const {userId} = request.session
  const {boardId} = request.params
  commands.removeUserFromBoard(userId, boardId)
    .then( () => {
      response.json(null)
    })
    .catch(next)

})

export default router
