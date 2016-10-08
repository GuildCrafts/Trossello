import Knex from 'knex'

// paths are relative to build/server/database/index.js
require('../../../config/environment')
const config = require('../../../knexfile')[process.env.NODE_ENV]
const knex = Knex(config)

knex.truncateAllTables = function(){
  return Promise.all([
    knex.table('user_boards').del(),
    knex.table('cards').del(),
    knex.table('lists').del(),
    knex.table('boards').del(),
    knex.table('users').del(),
  ])
}

export default knex

