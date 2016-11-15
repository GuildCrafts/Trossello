
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('lists', function (table) {
      table.timestamps()
    }),
    knex.schema.table('boards', function (table) {
      table.timestamps()
    }),
    knex.schema.table('cards', function (table) {
      table.timestamps()
    }),
    knex.schema.table('invites', function (table) {
      table.timestamps()
    })
  ])
};

exports.down =  function(knex, Promise) {
  return Promise.all([
    knex.schema.table('lists', function (table) {
      table.dropTimestamps()
    }),
    knex.schema.table('boards', function (table) {
      table.dropTimestamps()
    }),
    knex.schema.table('cards', function (table) {
      table.dropTimestamps()
    }),
    knex.schema.table('invites', function (table) {
      table.dropTimestamps()
    })
  ])
};
