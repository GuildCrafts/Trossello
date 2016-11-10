
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.table('boards', function (table) {
      table.boolean('starred')
        .defaultTo(false)
        .notNullable()
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([

    knex.schema.table('boards', function (table) {
      table.dropColumn('starred');

    })
  ])
};
