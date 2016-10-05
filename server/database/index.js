import Knex from 'knex'
import queriesFactory from './queries'
import commandsFactory from './commands'

// paths are relative to build/server/database/index.js
require('../../../config/environment')
const config = require('../../../knexfile')[process.env.NODE_ENV]
const knex = Knex(config)
const queries = queriesFactory(knex)
const commands = commandsFactory(knex, queries)

knex.truncateAllTables = function(){
  return Promise.all([
    knex.table('user_boards').del(),
    knex.table('cards').del(),
    knex.table('lists').del(),
    knex.table('boards').del(),
    knex.table('users').del(),
  ])
}

export { knex, queries, commands }

