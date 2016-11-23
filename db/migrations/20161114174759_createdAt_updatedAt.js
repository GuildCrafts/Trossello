exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('lists', function (table) {
      table.timestamps(false,true)
    }),
    knex.schema.table('boards', function (table) {
      table.timestamps(false,true)
    }),
    knex.schema.table('cards', function (table) {
      table.timestamps(false,true)
    }),
    knex.schema.table('invites', function (table) {
      table.timestamps(false,true)
    })
  ] )
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
