function createUser(attributes) {
  return this.pg.table('users').insert(attributes)
}
export default {
  createUser
}
