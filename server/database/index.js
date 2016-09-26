const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'

import knex from 'knex'

const config = {
  development: {
    client: 'pg',
    connection: {
      database: 'trossello-development'
    },
    pool:{
      max:1
    }
  }
  test: {
    client: 'pg',
    connection: {
      database: 'trossello-test'
    }
  }
}

const connectionString = process.env.DATABASE_URL || `postgres://${process.env.USER}@localhost:5432/trossello-${process.env.NODE_ENV}`
const pg = knex(config[env])
knex.migrate.latest([config]);


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
