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

})
