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
    getRecordById('boards', id)

  const getCards = () =>
    getRecords('cards')

  const getCardById = (id) =>
    getRecordById('cards', id)

  return {
    getUsers,
    getUserById,
    getCards,
    getCardById,
    getBoardsByUserId,
    getBoardById,
  }

}
