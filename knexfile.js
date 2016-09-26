// Update with your config settings.
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const connectionString = (
  process.env.DATABASE_URL ||
  `postgres://${process.env.USER}@localhost:5432/trossello-${env}`
)

const defaultConfig = (database) => ({
  client: 'postgresql',
  connection: connectionString,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: __dirname + '/db/migrations',
    tableName: 'migrations'
  },
  seeds: {
    directory: __dirname + `/db/seeds/${database}`
  }
})

module.exports = {
  test: defaultConfig('trossello-test'),
  development: defaultConfig('trossello-development'),
};
