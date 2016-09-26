process.env.NODE_ENV = 'test';
process.env.PORT = process.env.PORT || '3123';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../server');

chai.use(chaiHttp);

module.exports = {
  chai: chai,
  should: should,
  chaiHttp: chaiHttp,
  server: server,
}
