import { LabelType } from "../interfaces";
import makeRequest from "./makeRequests";



export function getQuery(query: string, labelId: string) {
  // Construct the URL with the query and labelId parameters
  const url = `/notes/search/query?query=${encodeURIComponent(query)}&labelId=${encodeURIComponent(labelId)}`
  return makeRequest(url);
}

export function getNotes(labelId: string) {
  return makeRequest(`/notes/${labelId}`)
}

export function createNote(labels:LabelType[], title?: string, body?: string) {
  if (!Array.isArray(labels)) {
    labels = [labels]
  }
  const requestData = {
    title,
    body,
    labels: [...labels]
  };
  
  return makeRequest(`/notes/newnote`, {
    method: "POST",
    data: requestData
  })
}

interface noteState {
  isPinned?: boolean,
  isArchived?: boolean,
  isTrashed?: boolean
}

interface updateNoteArgs {
  body?: string, 
  title?: string,
  labels?: string
  id: string
  options?: noteState
}

export function updateNote({id, body, title, labels, options}: updateNoteArgs) {
  const requestData = {
    body,
    title,
    labels,
    ...options
  };
  return makeRequest(`/notes/${id}`, {
    method: "PATCH",
    data: requestData
  })
}

export function deleteNote(id: string) {
  return makeRequest(`/notes/${id}`, {
    method: "DELETE"
  })
}