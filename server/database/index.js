
import knex from 'knex'
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('../knexfile')[env] // path is relative to build/server.js
const pg = knex(config)
import queries from './queries'
import commands from './commands'
queries.pg = pg
commands.pg = pg
export { pg, queries, commands }


// const pg = knex({
//   client: 'pg',
//   connection: connectionString,
//   searchPath: 'knex,public',
//   migrations: {
//     tableName: 'migrations'
//   }
// });

// import pgPromise from 'pg-promise'
// import queries from './queries'
// import commands from './commands'

// const pgp = pgPromise()
// const db = pgp(connectionString)

// queries.pgp = pgp
// queries.pgp = pgp
// commands.db = db
// commands.db = db

// export { queries, commands }
