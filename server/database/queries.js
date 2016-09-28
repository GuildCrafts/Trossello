export default (knex) => ({

  getUsers() {
    return knex.table('users').select('*')
  },

  getUserById(id) {
    return knex.table('users').where('id', id).first('*')
  },

})
