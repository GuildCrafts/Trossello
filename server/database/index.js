
import knex from 'knex'
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'
// path is relative to build/server/database/index.js
const config = require('../../../knexfile')[env]
const pg = knex(config)
import queries from './queries'
import commands from './commands'
queries.pg = pg
commands.pg = pg

pg.truncateAllTables = function(){
  return Promise.all([
    this.truncate('users'),
    this.truncate('user_boards'),
    this.truncate('boards'),
    this.truncate('lists'),
    this.truncate('cards')
  ])
}

export { pg, queries, commands }

