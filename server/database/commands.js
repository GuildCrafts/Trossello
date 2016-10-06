export default (knex, queries) => {

  const firstRecord = records => records[0]

  const createRecord = (table, attributes) =>
    knex
      .table(table)
      .insert(attributes)
      .returning('*')
      .then(firstRecord)


  const updateRecord = (table, id, attributes) =>
    knex
      .table(table)
      .where('id', id)
      .update(attributes)
      .returning('*')
      .then(firstRecord)


  const deleteRecord = (table, id) =>
    knex
      .table(table)
      .where('id', id)
      .del()

  //

  const findOrCreateUserFromGithubProfile = (githubProfile) => {
    const github_id = githubProfile.id
    const userAttributes = {
      github_id: github_id,
      name: githubProfile.name,
      email: githubProfile.email,
      avatar_url: githubProfile.avatar_url,
    }
    return knex.table('users').where('github_id', github_id).first('*')
      .then(user => user ? user : createUser(userAttributes))
  }

  const createUser = (attributes) =>
    createRecord('users', attributes)


  const updateUser = (id, attributes) =>
    updateRecord('users', id, attributes)


  const deleteUser = (id) =>
    deleteRecord('users', id)


  //

  const createList = (attributes) => {
    return createRecord('lists', attributes)
  }

  const updateList = (id, attributes) =>
    updateRecord('lists', id, attributes)


  const deleteList = (id) =>
    deleteRecord('lists', id)

  //

  const createCard = (attributes) => {
    return createRecord('cards', attributes)
  }


  const updateCard = (id, attributes) =>
    updateRecord('cards', id, attributes)


  const deleteCard = (id) =>
    deleteRecord('cards', id)

  //

  const createBoard = (userId, attributes) =>{
    if (!attributes.background_color) delete attributes.background_color
    return createRecord('boards', attributes).then(board => {
      let attrs = {
        user_id: userId,
        board_id: board.id,
      }
      return createRecord('user_boards', attrs).then(() => board)
    })
  }


  const updateBoard = (id, attributes) =>
    updateRecord('boards', id, attributes)


  const deleteBoard = (boardId) =>
    Promise.all([
      deleteRecord('boards', boardId),
      knex.table('user_boards').where('board_id', boardId).del(),
    ]).then(results => results[0] + results[1])


  return {
    createUser,
    updateUser,
    deleteUser,
    findOrCreateUserFromGithubProfile,
    createList,
    updateList,
    deleteList,
    createCard,
    updateCard,
    deleteCard,
    createBoard,
    updateBoard,
    deleteBoard,
  }

}
