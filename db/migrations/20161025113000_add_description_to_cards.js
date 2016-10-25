exports.up = function(knex, Promise) {
  return knex.schema.table('cards', function(table) {
    table.text('description')
    .defaultTo('')
    .notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('cards', function(table) {
    table.dropColumn('description');
  })
};
