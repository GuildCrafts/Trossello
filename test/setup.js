process.env.NODE_ENV = 'test';
process.env.PORT = process.env.PORT || '3123';

var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var server = require('../server');
var database = require('../server/database');
const { queries, commands } = database

chai.use(chaiHttp);

beforeEach(done => {
  database.pg.migrate.latest()
    .then(() => database.pg.truncateAllTables() )
    .then(() => { done() })
    .catch(done)
})

module.exports = {
  chai,
  expect,
  server,
  database,
  queries,
  commands,
}
