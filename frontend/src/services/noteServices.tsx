import { LabelType } from "../interfaces";
import makeRequest from "../utils/makeRequests";


export function getNotes(labelId: string, query: string) {
  const url = `/notes/${labelId}?query=${query}`
  return makeRequest(url);
}

export function createNote(labels: LabelType[], title?: string, body?: string) {
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

export function togglePinOnNote(noteId: number, newPinStatus: boolean): Promise<unknown> {

  const requestData = {
    isPinned: newPinStatus
  };
  return makeRequest(`/notes/${noteId}`, {
    method: "PATCH",
    data: requestData
  })
}

export function archiveOnNote(noteId: number): Promise<unknown> {
  const requestData = {
    isArchived: true,
    isTrashed: false
  };
  return makeRequest(`/notes/${noteId}`, {
    method: "PATCH",
    data: requestData
  })
}

export function trashOnNote(noteId: number): Promise<unknown> {
  const requestData = {
    isTrashed: true,
    isArchived: false
  };
  return makeRequest(`/notes/${noteId}`, {
    method: "PATCH",
    data: requestData
  })
}

export function restoreOnNote(noteId: number): Promise<unknown> {
  const requestData = {
    isTrashed: false,
    isArchived: false
  };
  return makeRequest(`/notes/${noteId}`, {
    method: "PATCH",
    data: requestData
  })
}

export function deleteNote(noteId: number): Promise<unknown> {
  return makeRequest(`/notes/${noteId}`, {
    method: "DELETE"
  })
}

export function updateNoteContents(noteId: number, title: string, body: string): Promise<unknown> {
  const requestData = {
    body,
    title,
  };
  return makeRequest(`/notes/${noteId}`, {
    method: "PATCH",
    data: requestData
  })
}

export function updateNoteLabels(noteId: number, labels): Promise<unknown> {
  const requestData = {
   labels
  };
  return makeRequest(`/notes/${noteId}`, {
    method: "PATCH",
    data: requestData
  })
}
