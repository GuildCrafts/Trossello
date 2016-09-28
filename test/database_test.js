const { expect, queries, commands } = require('./setup')

describe('database', () => {

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

  context('when there are users in the database', () => {
    beforeEach( () => {
      return Promise.all([
        commands.createUser({
          id: 1455,
          github_id: 22312,
          name: 'Mark Zuckerburg',
          email: 'mark@zuckerburg.io',
        }),
        commands.createUser({
          id: 6672,
          github_id: 9775,
          name: 'Larry Harvey',
          email: 'larry@harvey.to',
        })
      ])
    })

    describe('getUsers', () => {
      it('should return an array of all users', () => {
        return queries.getUsers().then( users => {
          expect(users).to.be.a('array')
          expect(users.length).to.eql(2)

          users.forEach(user => {
            if (user.id === 1455){
              expect(user).to.be.a('object')
              expect(user.id).to.eql(1455)
              expect(user.name).to.eql('Mark Zuckerburg')
              expect(user.email).to.eql('mark@zuckerburg.io')
            }else if (user.id === 6672){
              expect(user).to.be.a('object')
              expect(user.id).to.eql(6672)
              expect(user.name).to.eql('Larry Harvey')
              expect(user.email).to.eql('larry@harvey.to')
            }else{
              throw new Error('unexpected user record')
            }
          })
        })
      })
    })

    describe('getUserById', () => {
      it('should return json by user id', () => {
        return queries.getUserById(1455).then( user => {
          expect(user).to.be.a('object')
          expect(user.id).to.eql(1455)
          expect(user.name).to.eql('Mark Zuckerburg')
          expect(user.email).to.eql('mark@zuckerburg.io')
        })
      })
    })

    describe('deleteUser', () => {
      it('should delete a user by user id', () => {
        return queries.getUserById(1455).then( user => {
          expect(user).to.be.a('object')
          expect(user.id).to.eql(1455)
          return commands.deleteUser(1455).then( () => {
            return queries.getUserById(1455).then( user => {
              expect(user).to.be.undefined
            })
          })
        })
      })
    })

    describe('updateUser', () => {

      it('should update a user with given attributes', () => {
        const userAttributes = {
          name: 'Majid Rahimi',
          email: 'majid@gmail.com',
        }
        return commands.updateUser(1455, userAttributes).then( user => {
          expect(user).to.be.a('object')
          expect(user.id).to.eql(1455)
          expect(user.name).to.eql('Majid Rahimi')
          expect(user.email).to.eql('majid@gmail.com')

          return queries.getUsers().then( users => {
            expect(users.length).to.eql(2)
            users.forEach(user => {
              if (user.id === 1455){
                expect(user).to.be.a('object')
                expect(user.id).to.eql(1455)
                expect(user.name).to.eql('Majid Rahimi')
                expect(user.email).to.eql('majid@gmail.com')
              }else if (user.id === 6672){
                expect(user).to.be.a('object')
                expect(user.id).to.eql(6672)
                expect(user.name).to.eql('Larry Harvey')
                expect(user.email).to.eql('larry@harvey.to')
              }else{
                throw new Error('unexpected user record')
              }
            })
          })
        })
      })

    })

    describe('findOrCreateUserFromGithubProfile', () => {
      context('when logging in as a new user', () => {
        it('should create a new user record', () => {
          const githubProfile = {
            id: 445,
            name: 'Page Hathaway',
            email: 'page@hathaway.io',
            avatar_url: 'http://page.com/hathaway.jpg',
          }
          return commands.findOrCreateUserFromGithubProfile(githubProfile).then(user => {
            expect(user.id).to.be.a('number')
            expect(user.id).to.not.eql(1455)
            expect(user.id).to.not.eql(6672)
          })
        })
      })

      context('when logging in as an existing user', () => {
        it('should find that user record by its github_id', () => {
          const githubProfile = {
            id: 22312,
            name: 'Mark Elliot Zuckerburg',
            email: 'mark@zuckerburg.io',
            avatar_url: 'http://mark.com/zucker.jpg',
          }
          return commands.findOrCreateUserFromGithubProfile(githubProfile).then(user => {
            expect(user.id).to.eql(1455)
          })
        })
      })
    })

  })


})
