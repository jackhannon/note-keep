export function removeNote(noteId, notes) {
  const pinnedNotes = notes.pinnedNotes.filter(note => note._id !== noteId)
  const plainNotes = notes.plainNotes.filter(note => note._id !== noteId)
  return {pinnedNotes, plainNotes}
}


export function removeSelectedNotes(noteIds, notes) {
  const pinnedNotes = notes.pinnedNotes.filter(note => !noteIds.includes(note._id))
  const plainNotes = notes.plainNotes.filter(note => !noteIds.includes(note._id))
  return {pinnedNotes, plainNotes}
}