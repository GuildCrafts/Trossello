
exports.up = function(knex, Promise) {
  return knex.schema.raw(`
    BEGIN;
    ALTER TABLE lists ADD COLUMN archived boolean;
    ALTER TABLE lists ALTER COLUMN archived TYPE boolean;
    UPDATE lists set archived=false;
    COMMIT;
  `)
};

exports.down = function(knex, Promise) {
  return knex.schema.raw(`
    BEGIN;
    ALTER TABLE lists DROP COLUMN archived;
    COMMIT;
  `)
};
