function getUsers() {
  return this.pg.table('users').select('*')
}

function getUserById(id) {
  return this.pg.table('users').first('*').where('id', id)
}

export default {
  getUsers,
  getUserById
}
