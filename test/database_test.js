const { expect, queries, commands } = require('./setup')

describe('database', () => {

  describe('when there are users in the database', () => {
    beforeEach( () => {
      return Promise.all([
        commands.createUser({
          id: 1455,
          name: 'Mark Zuckerburg',
          email: 'mark@zuckerburg.io',
        }),
        commands.createUser({
          id: 6672,
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
          expect(user).to.have.property('id')
          expect(user.id).to.be.a('number')
          expect(user.name).to.eql('Mark Zuckerburg')
          expect(user.email).to.eql('mark@zuckerburg.io')
        })
      })
    })

    describe('deleteUser', () => {
      it('should delete a user by user id', () => {
        return commands.deleteUser(1455).then( () => {
          queries.getUserById(1455).then( user => {
            expect(user).to.be.undefined
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
          queries.getUsers().then( users => {
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

  })

})
