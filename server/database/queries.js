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
    .whereIn('user_boards.user_id', userId)
    .where('archived', false)

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

const getBoardById = (id) =>
  getRecordById('boards', id)
    .then( board => {
      if (board){
        return Promise.all([
          getListsAndCardsForBoard(board),
          getUsersForBoard(board)
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
}

const getListsAndCardsForBoard = (board) => {
  return knex.table('lists')
    .select('*')
    .where({
      board_id: board.id
    })
    .orderBy('id', 'asc')
    .then(lists => {
      board.lists = lists
      const listIds = lists.map(list => list.id)
      return knex.table('cards')
        .select('*')
        .whereIn('list_id', listIds)
        .orderBy('id', 'asc')
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

// INVITES

const verifyToken = (token) => {
  return knex.table('invites')
    .select('*')
    .where('token', token)
    .first()
}

export default {
  getUsers,
  getUserById,
  getCardById,
  getSearchResult,
  getBoardsByUserId,
  getBoardById,
  getListById,
  verifyToken,
}
