export default (knex) => ({

  getUsers() {
    return knex.table('users').select('*')
  },

  getUserById(id) {
    return knex.table('users').where('id', id).first('*')
  },

  getCards() {
    return knex.table('cards').select('*')
  },

  getCardById(id) {
    return knex.table('cards').where('id', id).first('*')
  },

  getBoardsByUserId(userId) {
    return knex.table('boards')
      .select('boards.*')
      .join('user_boards', 'boards.id', '=', 'user_boards.board_id')
      .where('user_boards.user_id', userId)
  },

  getBoardById(boardId) {
    return knex.table('boards')
      .first('*')
      .where('id', boardId)
      .returning('*')
  },

})
