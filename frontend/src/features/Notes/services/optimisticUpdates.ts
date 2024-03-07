export function removeNote(noteId, pages) {
  const newPages = pages.map(page => {
    return page.filter(note => note._id !== noteId)
  })
  return newPages
}


export function removeSelectedNotes(noteIds, pages) {
  const newPages = pages.map(page => {
    return page.filter(note => !noteIds.includes(note._id))
  })
  return newPages
}