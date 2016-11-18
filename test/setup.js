process.env.NODE_ENV = 'test';
process.env.PORT = process.env.PORT || '3123';
process.env.SESSION_KEY = 'test-session-key'

const chalk = require('chalk');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
const { knex, queries, commands } = require('../server/database');
const mailer = require('../server/mailer').default
const jsdom = require('jsdom').jsdom
const { shallow, mount } = require('enzyme')

chai.use(chaiHttp);

let browserInstance

beforeEach(() => {
  global.document = jsdom('')
  global.window = document.defaultView;
  global.navigator = {
    userAgent: 'node.js'
  }
  mailer.transporter.reset()
  browserInstance = chai.request.agent(server)
  return knex.migrate.latest().then(() => knex.truncateAllTables() )
})

// request('GET', '/api/users/12').then(response)
const request = (method, url, postBody) => {
  method = method.toLowerCase()
  return new Promise((resolve, reject) => {
    var req = browserInstance[method](url)
    if (method === 'post' && postBody) req = req.send(postBody)
    req.end((error, response) => {
      if (error && error.status >= 500) {
        console.warn(chalk.red('Server Error: '+response.body.error.message))
        console.warn(chalk.red(response.body.error.stack))
        reject(error)
      }else{
        resolve(response)
      }
    })
  })
}

module.exports = {
  chai,
  expect,
  request,
  server,
  knex,
  queries,
  commands,
  mailer,
  shallow,
  mount,
}
