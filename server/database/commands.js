function createUser(attributes) {
  return this.pg
    .table('users')
    .insert(attributes)
    .returning('*')
    .then(users => users[0])
}

function deleteUser(userId) {
  return this.pg.table('users').where('id', userId).del()
}

function updateUser(id, attrs) {
  return this.pg.table('users')
    .where('id', id).update(attrs)
    .returning('id')
}

function findOrCreateUserFromGithubProfile(githubProfile){
  const github_id = githubProfile.id

  const userAttributes = {
    email: githubProfile.email,
    github_id: github_id,
    name: githubProfile.name,
    avatar_url: githubProfile.avatar_url,
  }

  return this.pg.table('users').select('*').first('github_id', github_id)
    .then(user => {
      if (user){
        console.log('user exists', user)
        return user
      }
      return this.createUser(userAttributes)
        .then(user => {
          return this.pg.table('users').select('*').first('id', user.id)
        })
        .then(user => {
          console.log('created user', user)
          return user
        })
    })

}

export default {
  createUser,
  deleteUser,
  updateUser,
  findOrCreateUserFromGithubProfile
}
