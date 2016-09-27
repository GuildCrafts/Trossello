const { chai, expect, server, commands } = require('./setup')


describe('API', () => {
  describe('GET /api/users', () => {
    it('should render a json array of all users', (done) => {
      chai.request(server)
        .get('/api/users')
        .end((error, response) => {
          if (error) throw error
          expect(response).to.have.status(200);
          expect(response).to.be.json; // jshint ignore:line
          expect(response.body).to.be.an('array');
          expect(response.body.length).to.equal(2);
          expect(response.body[0]).to.have.property('id');
          expect(response.body[0]).to.have.property('email');
          done();
        });

    });

  });


  describe('GET /api/users/:id', () => {
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
    it('Should render a user by id', (done) => {
      chai.request(server)
        .get('/api/users/6672')
        .end((error, response) => {
          if (error) throw error
          expect(response).to.have.status(200);
          expect(response).to.be.json; // jshint ignore:line
          expect(response.body).to.be.an('object');
          expect(response.body.email).to.equal('larry@harvey.to');
          done();
        });
    });
  });


  describe('POST /api/users', () => {
    it('should create a user', (done) => {
      chai.request(server)
        .post('/api/users')
        .send({
          email: "majid@gmail.com",
          password: "123"
        })
        .end((error, response) => {
          if (error) throw error
          expect(response).to.have.status(200);
          expect(response).to.be.json; // jshint ignore:line
          done();
        });
    });
  });


});
