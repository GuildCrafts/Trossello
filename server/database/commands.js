export default (knex, queries) => ({

  createUser(attributes) {
    return knex
      .table('users')
      .insert(attributes)
      .returning('*')
      .then(firstRecord)
  },

  deleteUser(userId) {
    return knex.table('users')
      .where('id', userId)
      .del()
  },

  updateUser(id, attrs) {
    return knex.table('users')
      .where('id', id)
      .update(attrs)
      .returning('*')
      .then(firstRecord)
  },

  findOrCreateUserFromGithubProfile(githubProfile){
    const github_id = githubProfile.id
    const userAttributes = {
      github_id: github_id,
      name: githubProfile.name,
      email: githubProfile.email,
      avatar_url: githubProfile.avatar_url,
    }
    return knex.table('users').where('github_id', github_id).first('*')
      .then(user => user ? user : this.createUser(userAttributes))
  },

  createCard(attributes) {
      return knex
    .table('cards')
    .insert(attributes)
    .returning('*')
    .then(firstRecord)
  },

  deleteCard(cardId) {
    return knex.table('cards')
      .where('id', cardId)
      .del()
  },

  updateCard(id, attrs) {
    return knex.table('cards')
      .where('id', id)
      .update(attrs)
      .returning('*')
      .then(firstRecord)
  },

});

const firstRecord = records => records[0];
