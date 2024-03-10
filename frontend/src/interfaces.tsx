export type LabelType = {
  _id: string;
  title: string;
}

export type NoteType = {
  _id: string;
  date: number
  title?: string;
  body?: string;
  labels: string[];
  isPinned: boolean;
  isTrashed: boolean;
  isArchived: boolean;
}

export type NotesData = {
  queriedNotes: NoteType[] 
}

export type UserInfo = {
  username: string
  password: string
}