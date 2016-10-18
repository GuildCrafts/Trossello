
exports.up = function(knex, Promise) {
  return knex.schema.raw(`
    BEGIN;
    ALTER TABLE boards ADD COLUMN archived boolean;
    ALTER TABLE boards ALTER COLUMN archived TYPE boolean;
    UPDATE boards set archived=false;
    COMMIT;
  `)
};

exports.down = function(knex, Promise) {
  return knex.schema.raw(`
    BEGIN;
    ALTER TABLE boards DROP COLUMN archived;
    COMMIT;
  `)
};
