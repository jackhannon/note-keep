import { HttpResponse, http } from 'msw'
import { notesData } from './data/notesData'
import { labelsData } from './data/labelsData'
 
export const handlers = [
  http.get("notes/label", () => {
    return HttpResponse.json(labelsData)
  }),
  http.get("notes/Notes", () => {
    return HttpResponse.json(notesData)
  }),
  http.patch("notes/*", () => {
    return new HttpResponse("success", {status: 200})
  })
]

