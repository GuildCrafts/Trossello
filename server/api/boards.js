import express from 'express'
import {queries, commands} from '../database'
const router = new express.Router()

// INDEX
router.get('/', (request, response, next) => {
  queries.getBoardsByUserId(request.session.userId).then(boards => {
    response.json(boards)
  }).catch(next)
})

// MOVE TARGETS
router.get('/move-targets', (request, response, next) => {
  queries.getBoardMoveTargetsForUserId(request.session.userId).then(boards => {
    response.json(boards)
  }).catch(next)
})

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
  commands.updateBoard(request.session.userId, request.params.boardId, request.body)
  .then(boardId => {
    response.json(boardId)
  }).catch(next)
})

// DELETE
router.post('/:boardId/archive', (request, response, next) => {
  const boardId = request.params.boardId
  commands.archiveBoard(boardId).then( board => {
    if (board) {
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
  commands.createList(request.session.userId, list)
    .then( list => {
      response.json(list)
    })
    .catch(next)
})

// CREATE CARD
router.post('/:boardId/lists/:listId/cards', (request, response, next) => {
  let { content, order } = request.body
  let { boardId, listId } = request.params
  let { userId } = request.session

  const newCard = {
    content: content,
    board_id: Number(boardId),
    list_id: Number(listId),
    order: Number(order),
  }

  commands.createCard(Number(userId), newCard)
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

// STAR BOARD
router.post('/:boardId/star', (request, response, next) => {
  const {boardId} = request.params
  commands.starBoard(boardId)
    .then( board => {
      response.json(null)
    })
    .catch(next)
})

// UNSTAR BOARD
router.post('/:boardId/unstar', (request, response, next) => {
  const {boardId} = request.params
  commands.unstarBoard(boardId)
    .then( () => {
      response.json(null)
    })
    .catch(next)
})

// DUPLICATE LIST
router.post('/:boardId/lists/:listId/duplicate', (request, response, next) => {
  const { boardId, listId } = request.params
  const { name } = request.body
  const { userId } = request.session

  commands.duplicateList(userId, boardId, listId, name)
    .then(newList => {
      response.json(newList)
    })
    .catch(next)
})

//CREATE LABEL
router.post('/:boardId/labels', (request, response, next) => {
  const { boardId } = request.params
  const { color, text, cardId } = request.body
  const attributes = {
    board_id: boardId,
    text: text,
    color: color,
    card_id: cardId
  }

  commands.createLabel(attributes)
    .then(label => {
      response.json(label)
    })
    .catch(next)
})

//UPDATE LABEL
router.post('/:boardId/labels/:labelId', (request, response, next) => {
  const { boardId, labelId } = request.params
  const { color, text } = request.body
  const attributes ={board_id: boardId, text: text, color: color}

  commands.updateLabel(labelId, attributes)
    .then(label => {
      response.json(label)
    })
    .catch(next)
})

//DELETE LABEL
router.post('/:boardId/labels/:labelId/delete', (request, response, next) => {
  const { boardId, labelId } = request.params

  commands.deleteLabel(labelId)
    .then(() => {
      response.json(null)
    })
    .catch(next)
})


//GET LABEL
router.get('/:boardId/labels/:labelId', (request, response, next) => {
  const {boardId, labelId} = request.params

  queries.getLabelById(labelId)
    .then(label => {
      response.json(label)
    })
    .catch(next)
})

export default router
