process.env.NODE_ENV = 'test';
process.env.PORT = process.env.PORT || '3123';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../server');
var database = require('../server/database');

chai.use(chaiHttp);

beforeEach(done => {
  database.pg.migrate.latest()
    .then(() => database.pg.truncateAllTables() )
    .then(() => { done() })
    .catch(done)
})

module.exports = {
  chai: chai,
  should: should,
  chaiHttp: chaiHttp,
  server: server,
}
