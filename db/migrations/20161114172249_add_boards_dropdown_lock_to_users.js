exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.boolean('boards_dropdown_lock')
    .defaultTo(false)
    .notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('boards_dropdown_lock');
  })
};
