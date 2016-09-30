const FakeBoards = [
  {
    id: 1,
    name: 'Peters Life',
    background_color: 'blue',
    lists: [
      {
        id: 2321321,
        name: 'Home Shopping',
        cards: [
          { id: 111, description: "buy some cheese" },
          { id: 112, description: "buy some milk" },
          { id: 113, description: "buy some salad" },
          { id: 114, description: "buy some carrots" },
        ]
      },
      {
        id: 3444,
        name: 'Work Stuffs',
        cards: [
          { id: 221, description: "TPS reports" },
          { id: 222, description: "clean our junk drawer" },
          { id: 223, description: "read 1,000 lines of code" },
          { id: 224, description: "learn everything about react" },
          { id: 225, description: "buy Jared a donut" },
          { id: 226, description: "steal Stan's stapler" },
          { id: 227, description: "take a nap" },
        ]
      },
      {
        id: 35564,
        name: 'Pet Projects',
        cards: [
          { id: 331, description: "build a chair" },
          { id: 332, description: "skin a rabit" },
          { id: 333, description: "paint a boat" },
          { id: 334, description: "drill some holes" },
          { id: 335, description: "hand some stuff" },
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'empty board example',
    background_color: 'purple',
    lists: []
  }
]

const boards = (state = {records:FakeBoards}, action) => {
  return state
}

export default boards
