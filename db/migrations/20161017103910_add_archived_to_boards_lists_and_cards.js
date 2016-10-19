exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('lists', function (table) {
      table.boolean('archived')
        .defaultTo(false)
        .notNullable()
    }),
    knex.schema.table('boards', function (table) {
      table.boolean('archived')
        .defaultTo(false)
        .notNullable()
    }),
    knex.schema.table('cards', function (table) {
      table.boolean('archived')
        .defaultTo(false)
        .notNullable()
    }),

  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('lists', function (table) {
      table.dropColumn('archived');
    }),
    knex.schema.table('boards', function (table) {
      table.dropColumn('archived');
    }),
    knex.schema.table('cards', function (table) {
      table.dropColumn('archived');
    }),

  ])
};
