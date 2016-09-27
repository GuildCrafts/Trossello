function createUser(attributes) {
  return this.pg.table('users').insert(attributes)
}
function deleteUser(userId) {
  return this.pg.table('users').where('id', userId).del()
}
export default {
  createUser, deleteUser
}
