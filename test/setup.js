process.env.NODE_ENV = 'test';
process.env.PORT = process.env.PORT || '3123';

var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var server = require('../server');
var database = require('../server/database');
const { queries, commands } = database

chai.use(chaiHttp);

// request('GET', '/api/users/12').then(response)
const request = (method, url, postBody) => {
  method = method.toLowerCase()
  return new Promise((resolve, reject) => {
    var req = chai.request(server)[method](url)
    if (method === 'post' && postBody) req = req.send(postBody)
    req.end((error, response) => {
      if (error && error.status >= 500) {
        reject(error) 
      }else{
        resolve(response)
      }
    })
  })
}

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
  request,
}
