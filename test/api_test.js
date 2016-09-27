const { chai, expect, server } = require('./setup')


describe('API', () => {
  describe('GET /api/users', () => {
    it('should render a json array of all users', (done) => {
      chai.request(server)
        .get('/api/users')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json; // jshint ignore:line
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(2);
          expect(res.body[0]).to.have.property('id');
          expect(res.body[0]).to.have.property('email');
          done();
        });

    });
  });
});
