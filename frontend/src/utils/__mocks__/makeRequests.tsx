const makeRequestMock = async (url: string, options?: object) => {
  console.log("runrunrun")
  return Promise.resolve({
    data: {
      pinnedNotes: [
        {
          _id: '1',
          title: 'note 1',
          body: 'note 1 body',
          labels: [],
          isPinned: true,
          isTrashed: false,
          isArchived: false,
        },
        {
          _id: '2',
          title: 'note 2',
          body: 'note 2 body',
          labels: [],
          isPinned: true,
          isTrashed: false,
          isArchived: false,
        },
      ],
      plainNotes: [
        {
          _id: '3',
          title: 'note 3',
          body: 'note 3 body',
          labels: [],
          isPinned: false,
          isTrashed: false,
          isArchived: false,
        },
      ],
    },
    status: 200,
  });
};

export default makeRequestMock;