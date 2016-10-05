exports.up = function(knex, Promise) {
  return knex.schema.table('boards', function (table) {
    table.string('background_color')
      .defaultTo('#0079bf')
      .notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('boards', function (table) {
    table.dropColumn('background_color');
  })
};
