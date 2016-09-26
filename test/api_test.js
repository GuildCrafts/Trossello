const { chai, should, chaiHttp, server } = require('./setup')


describe('API', () => {
  describe('GET /api/users', () => {
    it('should render a json array of all users', (done) => {
      chai.request(server)
        .get('/api/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json; // jshint ignore:line
          res.body.should.be.a('array');
          res.body.length.should.equal(2);
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('email');
          done();
        });

    });
  });
});
