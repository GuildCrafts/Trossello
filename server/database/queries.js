export default (knex) => {

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

  const getBoardById = (id) =>
    getRecordById('boards', id).then(getListsAndCardsForBoard)

  const getListsAndCardsForBoard = (board) => {
    if (!board) return Promise.resolve(board)
    return knex.table('lists')
      .select('*')
      .where('board_id', board.id)
      .then(lists => {
        board.lists = lists
        const listIds = lists.map(list => list.id)
        return knex.table('cards')
          .select('*')
          .whereIn('list_id', listIds)
          .then(cards => {
            board.cards = cards
            return board
          })
      })
  }

  const getCardById = (id) =>
    getRecordById('cards', id)

  return {
    getUsers,
    getUserById,
    getCardById,
    getBoardsByUserId,
    getBoardById,
  }

}
