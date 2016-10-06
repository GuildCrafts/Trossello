exports.seed = (knex, Promise) => {
   return knex('lists').del()
    .then(() => {
      return Promise.all([
        knex('lists').insert({
          id: 1,
          board_id: 1,
          name: 'Home Shopping',
        }),
        knex('lists').insert({
          id: 2,
          board_id: 1,
          name: 'Glue Shopping',
        }),
        knex('lists').insert({
          id: 3,
          board_id: 1,
          name: 'Shoe Shopping',
        }),
        knex('lists').insert({
          id: 4,
          board_id: 2,
          name: 'Study Programming',
        }),
        knex('lists').insert({
          id: 5,
          board_id: 3,
          name: 'Nail Shopping',
        }),
      ]);
    })
};

