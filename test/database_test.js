const { expect, queries, commands } = require('./setup')

describe('database', () => {

  describe('getUsers', () => {

    it('should return an empty array', (done) => {
      queries.getUsers().then( users => {
        expect(users).to.be.a('array')
        expect(users.length).to.eql(0)
        done();
      })
    });

    describe('when there are users in the database', () => {
      beforeEach( done => {
        Promise.all([
          commands.createUser({
            email: 'mark@zuckerburg.io',
            password: 'password',
          }),
          commands.createUser({
            email: 'larry@harvey.to',
            password: 'password',
          })
        ]).then(() => { done() }).catch(done)
      })

      it('should return an array of all users', (done) => {
        queries.getUsers().then( users => {
          expect(users).to.be.a('array')
          expect(users.length).to.eql(2)
          expect(users[0]).to.have.property('id')
          expect(users[0].id).to.be.a('number')
          expect(users[0].email).to.eql('mark@zuckerburg.io')
          expect(users[0].password).to.eql('password')
          expect(users[1]).to.have.property('id')
          expect(users[1].id).to.be.a('number')
          expect(users[1].email).to.eql('larry@harvey.to')
          expect(users[1].password).to.eql('password')
          done();
        })
      })

    })

  })

  describe('getUserById', () => {
    beforeEach( done => {
      Promise.all([
        commands.createUser({
          id: 1455,
          email: 'mark@zuckerburg.io',
          password: 'password',
        }),
        commands.createUser({
          id: 6672,
          email: 'larry@harvey.to',
          password: 'password',
        })
      ]).then(() => { done() }).catch(done)
    })
    it('should return json by user id', (done) => {
      queries.getUserById(1455).then( user => {
        expect(user).to.be.a('object')
        expect(user).to.have.property('id')
        expect(user.id).to.be.a('number')
        expect(user.email).to.eql('mark@zuckerburg.io')
        expect(user.password).to.eql('password')
        done();
      })
    });
  })

  describe('deleteUser', () => {
    beforeEach( done => {
      Promise.all([
        commands.createUser({
          id: 1455,
          email: 'mark@zuckerburg.io',
          password: 'password',
        }),
        commands.createUser({
          id: 6672,
          email: 'larry@harvey.to',
          password: 'password',
        })
      ]).then(() => { done() }).catch(done)
    })
    it('should delete a user by user id', (done) => {
      commands.deleteUser(1455).then( () => {
        queries.getUserById(1455).then( user => {
          console.log('user', user)
          expect(user).to.be.undefined
          done();
        })
      })
    })
  })


  describe('updateUser', () => {
    beforeEach( done => {
      Promise.all([
        commands.createUser({
          id: 1455,
          email: 'mark@zuckerburg.io',
          password: 'password',
        }),
        commands.createUser({
          id: 6672,
          email: 'larry@harvey.to',
          password: 'password',
        })
      ]).then(() => { done() }).catch(done)
    })
    it('should update a user with given attributes', (done) => {
      const attrs = {email: 'majid@gmail.com', password: '123'}
      commands.updateUser(1455, attrs)
        .then( user => {
          queries.getUserById(1455).then( user => {
            expect(user).to.be.a('object')
            expect(user).to.have.property('id')
            expect(user.id).to.be.a('number')
            expect(user.email).to.eql('majid@gmail.com')
            expect(user.password).to.eql("123")
            done();
          })
      })
    })

  })


})
