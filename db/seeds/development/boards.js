
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('boards').del()
    .then(() => {
      return Promise.all([
        // Inserts seed entries
        knex('boards').insert({
          id: 1,
          name: 'Aileen',
          background_color: 'purple',
        }),
        knex('boards').insert({
          id: 2,
          name: 'Harman',
          background_color: 'green', 
        }),
        knex('boards').insert({
          id: 3,
          name: 'George',
          background_color: 'blue',
        })
      ]);
    })
};
