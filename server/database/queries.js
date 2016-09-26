const getUsers = () => {

  this.pg.any('SELECT * FROM users');
}


export default {
  getUsers
}
