function getUsers() {
  return this.pg.table('users').select('*')
}


export default {
  getUsers
}
