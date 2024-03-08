import { NoteType } from "../../../interfaces"

export function removeNote(noteId: string, pages: NoteType[][]) {
  const newPages = pages.map(page => {
    return page.filter(note => note._id !== noteId)
  })
  return newPages
}


export function removeSelectedNotes(noteIds: string[], pages: NoteType[][]) {
  const newPages = pages.map(page => {
    return page.filter(note => !noteIds.includes(note._id))
  })
  return newPages
}