import Knex from 'knex'

// paths are relative to build/server/database/index.js
require('../../../config/environment')
const config = require('../../../knexfile')[process.env.NODE_ENV]
const knex = Knex(config)

knex.truncateAllTables = function(){
  return knex.schema.raw(`
    BEGIN;
    TRUNCATE user_boards RESTART IDENTITY CASCADE;
    TRUNCATE cards       RESTART IDENTITY CASCADE;
    TRUNCATE lists       RESTART IDENTITY CASCADE;
    TRUNCATE boards      RESTART IDENTITY CASCADE;
    TRUNCATE users       RESTART IDENTITY CASCADE;
    TRUNCATE activity    RESTART IDENTITY CASCADE;
    TRUNCATE invites     RESTART IDENTITY CASCADE;
    TRUNCATE labels      RESTART IDENTITY CASCADE;
    TRUNCATE card_labels RESTART IDENTITY CASCADE;
    TRUNCATE comments    RESTART IDENTITY CASCADE;
    TRUNCATE card_users  RESTART IDENTITY CASCADE;
    COMMIT;
  `)
}

export default knex
