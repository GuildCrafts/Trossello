process.env.NODE_ENV = 'test';
process.env.PORT = process.env.PORT || '3123';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
const { knex, queries, commands } = require('../server/database');

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

beforeEach(() => {
  return knex.migrate.latest().then(() => knex.truncateAllTables() )
})

module.exports = {
  chai,
  expect,
  request,
  server,
  knex,
  queries,
  commands,
}
