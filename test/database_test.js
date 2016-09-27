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
})
