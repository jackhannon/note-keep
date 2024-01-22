export interface LabelType {
  _id: string;
  title: string;
}

export interface NoteType {
  _id: string;
  title?: string;
  body?: string;
  labels: LabelType[];
  isPinned: boolean;
  isTrashed: boolean;
  isArchived: boolean
}

export interface notesState {
  plainNotes: NoteType[]
  pinnedNotes: NoteType[]
}

export interface userInfo {
  username: string
  password: string
}