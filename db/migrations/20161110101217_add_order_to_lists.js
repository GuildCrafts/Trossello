exports.up = function(knex, Promise) {
  return knex.schema.table('lists', function (table) {
    table.integer('order')
      .defaultTo(0)
      .notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('lists', function (table) {
    table.dropColumn('order');
  })
};
