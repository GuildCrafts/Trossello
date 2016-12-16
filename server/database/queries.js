import knex from './knex'


const getRecords = (table) =>
  knex.table(table).select('*')

const getRecordById = (table, id) =>
  knex.table(table).where('id', id).first('*')

const getUsers = () =>
  getRecords('users')

const getUserById = (id) =>
  knex.table('users').where('id', id).first('*')

const getBoardsByUserId = (userId) =>
  knex.table('boards')
    .select('boards.*')
    .join('user_boards', 'boards.id', '=', 'user_boards.board_id')
    .where('user_boards.user_id', userId)
    .where('archived', false)

const getBoardMoveTargetsForUserId = (userId) =>
  getBoardsByUserId(userId).then(boards =>
    knex.table('lists')
      .select('lists.*')
      .count('cards.id AS card_count')
      .join('cards', 'cards.list_id', '=', 'lists.id')
      .whereIn('lists.board_id', boards.map(board => board.id))
      .orderBy('lists.board_id', 'asc')
      .orderBy('lists.order', 'asc')
      .groupBy('lists.id')
      .then(lists => {
        lists.forEach(lists => lists.card_count = Number(lists.card_count))
        boards.forEach(board => {
          board.lists = lists.filter(list => list.board_id === board.id)
        })
        return boards
      })
  )

const getUsersForBoard = (board) => {
  return knex.table('users')
    .select('users.*')
    .join('user_boards', 'users.id', '=', 'user_boards.user_id' )
    .whereIn('user_boards.board_id', board.id)
    .then( users => {
      board.users = users
      return board
    })
}

const getLabelsForBoard = (board) => {
  return knex.table('labels')
    .select('*')
    .where({board_id: board.id})
    .orderBy('id', 'asc')
    .then( labels => {
      board.labels = labels
      return board
    })
}

const getBoardById = (id) =>
  getRecordById('boards', id)
    .then( board => {
      if (board){
        return Promise.all([
          getListsAndCardsForBoard(board),
          getUsersForBoard(board),
          getLabelsForBoard(board),
          getActivityForBoard(board),
        ]).then( () => board)
      }else{
        return Promise.resolve(board)
      }
    })

const getSearchResult = (userId, searchTerm) => {
  if (!searchTerm) return Promise.resolve([])
  return knex.table('cards')
    .select('*')
    .join('user_boards', 'cards.board_id', '=', 'user_boards.board_id')
    .whereIn('user_boards.user_id', userId)
    .where(knex.raw('archived = false AND lower(content) LIKE ?', `%${searchTerm.toLowerCase()}%`))
    .orderBy('id', 'asc')
    .then(loadLabelIdsForCards)
}

const loadLabelIdsForCards = cards =>
  knex.table('card_labels')
    .select('*')
    .whereIn('card_labels.card_id', cards.map(card => card.id))
    .then(cardLabels => {
      cards.forEach(card => {
        card.label_ids = cardLabels
          .filter(cardLabel => cardLabel.card_id === card.id)
          .map(cardLabel => cardLabel.label_id)
      })
      return cards
    })

const getCommentsForCards = cards =>
  knex.table('comments')
    .select('*')
    .whereIn('card_id', cards.map(card => card.id))
    .then(cardComments => {
      cards.forEach(card => {
        card.comments = cardComments
          .filter(cardComment => cardComment.card_id === card.id)
      })
      return cards
    })

const loadUserIdsForCards = (cards) => {
  return knex.table('card_users')
    .select('*')
    .whereIn('card_id', cards.map(card => card.id))
    .then(cardUsers => {
      cards.forEach(card => {
        card.user_ids = cardUsers
          .filter(cardUser => cardUser.card_id === card.id)
          .map(cardUser => cardUser.user_id)
      })
      return cards
    })
}

const getListsAndCardsForBoard = (board) => {
  return knex.table('lists')
    .select('*')
    .where({
      board_id: board.id
    })
    .orderBy('order', 'asc')
    .then(lists => {
      board.lists = lists
      const listIds = lists.map(list => list.id)
      return knex.table('cards')
        .select('*')
        .whereIn('list_id', listIds)
        .orderBy('list_id', 'asc')
        .orderBy('order', 'asc')
        .then( cards => {
          if (!cards) return Promise.resolve(cards)
          return Promise.all([
            loadLabelIdsForCards(cards),
            loadUserIdsForCards(cards),
            getCommentsForCards(cards),
          ]).then( () => cards)
        })
        .then(cards => {
          board.cards = cards
          return board
        })
    })
}

const getListById = (id) =>
  getRecordById('lists', id)


const getCardById = (id) =>
  getRecordById('cards', id)

const getLabelById = (id) =>
  getRecordById('labels', id)

const getInviteByToken = (token) => {
  return knex.table('invites')
    .select('*')
    .where('token', token)
    .first('*')
}

const getActivityForBoard = (board) => {
  return getActivityByBoardId(board.id)
    .then(activity => {
      board.activity = activity
      return board
    })
}

const getActivityByBoardId = (boardId) => {
  return knex.table('activity')
    .select('*')
    .where('board_id', boardId)
    .orderBy('created_at', 'desc')
}

const getUsersForCard = (cardId) => {
  return knex.table('card_users')
    .select('*')
    .where('card_id', cardId)
    .returning('*')
}

export default {
  getUsers,
  getUserById,
  getCardById,
  getSearchResult,
  getBoardsByUserId,
  getLabelsForBoard,
  getBoardById,
  getListById,
  getInviteByToken,
  getBoardMoveTargetsForUserId,
  getLabelById,
  getActivityByBoardId,
  getUsersForCard
}
