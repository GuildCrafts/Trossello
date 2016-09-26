const getUsers = () => {

  this.db.any('SELECT * FROM users');
}


export default {
  getUsers
}
