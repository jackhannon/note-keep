export interface LabelType {
  _id?: number | string;
  title: string;
}

export interface NoteType {
  _id: number;
  title?: string;
  body?: string;
  labels: LabelType[];
  isPinned: boolean;
  isTrashed: boolean;
  isArchived: boolean
}

export interface NotesData {
  plainNotes: NoteType[]
  pinnedNotes: NoteType[]
}

export interface UserInfo {
  username: string
  password: string
}