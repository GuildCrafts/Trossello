const { chai, should, chaiHttp, server } = require('./setup')

const { queries, commands } = require('../server/database')

describe('database', () => {

  describe('getUsers', () => {

    it('should return an empty array', (done) => {
      queries.getUsers().then( users => {
        users.should.be.a('array')
        users.length.should.eql(0)
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
          users.should.be.a('array')
          users.length.should.eql(2)
          users[0].should.have.property('id')
          users[0].id.should.be.a('number')
          users[0].email.should.eql('mark@zuckerburg.io')
          users[0].password.should.eql('password')
          users[1].should.have.property('id')
          users[1].id.should.be.a('number')
          users[1].email.should.eql('larry@harvey.to')
          users[1].password.should.eql('password')
          done();
        })
      })

    })

  })
})
