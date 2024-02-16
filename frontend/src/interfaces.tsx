export interface LabelType {
  _id: string;
  title: string;
}

export interface CreatedLabelType {
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

export interface NotesData {
  plainNotes: NoteType[]
  pinnedNotes: NoteType[]
}

export interface UserInfo {
  username: string
  password: string
}