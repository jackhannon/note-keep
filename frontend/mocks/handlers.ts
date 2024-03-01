import { HttpResponse, http } from 'msw'
import { notesData } from './data/notesData'
import { labelsData } from './data/labelsData'
 
const notes = notesData;

export const handlers = [
  http.get("notes/label", () => {
    return HttpResponse.json(notes)
  }),
  http.get("notes/Notes", () => {
    return HttpResponse.json(notes)
  }),
  http.patch("notes/*", () => {
    return new HttpResponse("success", {status: 200})
  }),

  http.post("notes/newnote", () => {
    notes.plainNotes.push({
      _id: '4',
      title: '',
      body: 'This is a new note!',
      labels: [],
      isPinned: false,
      isTrashed: false,
      isArchived: false,
    })
    return new HttpResponse("success", {status: 200})
  })
]

