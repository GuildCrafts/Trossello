const { expect, queries, commands } = require('../../setup')

describe('database.commands', () => {

  describe('createUser', () => {

    it('should insert a record into the users table', () => {
      const userAttributes = {
        name: 'Weird Al',
        email: 'weird@al.sexy',
      }
      return commands.createUser(userAttributes).then(user => {
        expect(user).to.be.a('object')
        expect(user.id).to.be.a('number')

        return queries.getUsers().then( users => {
          expect(users).to.be.a('array')
          expect(users.length).to.eql(1)
        })
      })
    })

  })


  describe('updateUser', () => {

  })

  describe('deleteUser', () => {

  })

  describe('findOrCreateUserFromGithubProfile', () => {

  })

  describe('createCard', () => {

  })

  describe('updateCard', () => {

  })

  describe('deleteCard', () => {

  })

  describe('createBoard', () => {

  })

  describe('updateBoard', () => {

  })

  describe('deleteBoard', () => {

  })


})
