import { HttpResponse, http } from 'msw'
import { notesData } from './data/notesData'
import { labelsData } from './data/labelsData'

let notes = notesData;
const labels = labelsData

export const handlers = [
  http.get("notes/label", () => {
    return HttpResponse.json(labels)
  }),

  http.post("notes/label", () => {
    labels.push({_id: "4", title: "New, better label"})
    return new HttpResponse("success", {status: 200})
  }),

  http.patch("notes/label/*", () => {
    return new HttpResponse("success", {status: 200})
  }),

  // http.delete("notes/label/*", ({ request }) => {
  //   const url = new URL(request.url)
  //   const noteId = url.searchParams.get('id')
  //   notes = notes.filter(note => note._id !== noteId)
  //   return HttpResponse.json(notes)
  // }),

  http.get("notes/Notes", () => {
    const filteredNotes = notes.filter(note => !note.isTrashed)    
    return HttpResponse.json(filteredNotes)
  }),

 
  http.patch("notes/:id", async ({request, params}) => {
    const options = await request.json();

    const objectOptions = options?.valueOf();
    notes = notes.map(note => {
      if (note._id === params.id) {
        if (typeof objectOptions === "object") {
          return {...note, ...objectOptions}
        }
      }
      return note
    })
  
    return new HttpResponse("success", {status: 200})
  }),

  http.post("notes/newnote", () => {
    notes.push({
      _id: '4',
      title: '',
      body: 'This is a new note!',
      labels: [],
      date: Date.now(),
      isPinned: false,
      isTrashed: false,
      isArchived: false,
    })
    return new HttpResponse("success", {status: 200})
  }),

  http.delete("notes/*", () => {
    return new HttpResponse("success", {status: 200})
  }),
]

