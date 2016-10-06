exports.seed = (knex, Promise) => {
   return knex('cards').del()
    .then(() => {
      return Promise.all([
        knex('cards').insert([{
            board_id: 1,
            list_id: 1,
            content: 'Home Shopping',
          }, 
          {
            board_id: 1,
            list_id: 1,
            content: 'Donkey Shopping',
          },
          {
            board_id: 1,
            list_id: 1,
            content: 'Monkey Shopping',
          },
          ]),
        knex('cards').insert([{
            board_id: 2,
            list_id: 2,
            content: 'Study Programming',
          },
          {
            board_id: 2,
            list_id: 2,
            content: 'Study Donkey',
          },
          {
            board_id: 2,
            list_id: 2,
            content: 'Study Monkey',
          },
          ]),
        knex('cards').insert([{
            board_id: 3,
            list_id: 3,
            content: 'Home Study Shopping',
          },
          {
            board_id: 3,
            list_id: 3,
            content: 'Home Monkey Shopping',
          },
          {
            board_id: 3,
            list_id: 3,
            content: 'Home Donkey Shopping',
          },
          ]),
      ])
    })
}

