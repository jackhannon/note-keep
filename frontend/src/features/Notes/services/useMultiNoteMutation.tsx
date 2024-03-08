import { useMutation, useQueryClient, } from "@tanstack/react-query"
import { archiveOnNote, createNote, deleteNote, restoreOnNote, togglePinOnNote, trashOnNote } from "./noteServices"
import {  NoteType } from "../../../interfaces"
import { removeSelectedNotes } from "./optimisticUpdates"
import { useGlobalContext } from "../../../context/GlobalContext"

export const useMultiNoteMutation = (selectedNotes: NoteType[]) => {
  const queryClient = useQueryClient()

  const {query, currentLabel } = useGlobalContext()

  const pinStatusToToggle = selectedNotes.some(note => note.isPinned)
  const selectedNoteIds = selectedNotes.map(note => note._id)


  const toggleSelectedNotesPin = useMutation({
    mutationFn: () => {
      const promises = selectedNoteIds.map(noteId => {
        return togglePinOnNote(noteId, !pinStatusToToggle);
      });
    
      return Promise.all(promises);
    },
    onMutate: () => {
      const previousNotes = queryClient.getQueryData(['notes', currentLabel._id, query])
      queryClient.setQueryData(['notes', currentLabel._id, query], (prevNotes: {pages: NoteType[][]}) => {
        const filteredPages = prevNotes.pages.map(page => {
          return page.filter(note => !selectedNoteIds.includes(note._id))
        })
        const notesToAdd = selectedNotes.map(note =>  {
          return {...note, isPinned: !pinStatusToToggle}
        })

        if (pinStatusToToggle) {
          filteredPages[filteredPages.length-1] = [...filteredPages[filteredPages.length-1], ...notesToAdd]
        } else {
          filteredPages[0] = [...notesToAdd, ...filteredPages[0]]
        }
        return {...prevNotes, pages: filteredPages}
      })
      return { previousNotes }
    },

    onError: (err, newNotes, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
    },
    
  }) 


  const trashSelectedNotes = useMutation({
    mutationFn: () => {
      const promises = selectedNoteIds.map(noteId => {
        return trashOnNote(noteId)
      });
      return Promise.all(promises);
    },
    onMutate: () => {
      const previousNotes = queryClient.getQueryData(['notes', currentLabel._id, query])
      queryClient.setQueryData(['notes', currentLabel._id, query], (prevNotes: {pages: NoteType[][]}) => {
        const filteredPages = removeSelectedNotes(selectedNoteIds, prevNotes.pages)
        return {...prevNotes, pages: filteredPages}
      })
      return { previousNotes }
    },

    onError: (err, newNotes, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
    },
  }) 


  const archiveSelectedNotes = useMutation({
    mutationFn: () => {
      const promises = selectedNoteIds.map(noteId => {
        return archiveOnNote(noteId)
      });
      return Promise.all(promises);
    },
    onMutate: () => {
      const previousNotes = queryClient.getQueryData(['notes', currentLabel._id, query])

      queryClient.setQueryData(['notes', currentLabel._id, query], (prevNotes: {pages: NoteType[][]}) => {
        const filteredPages = removeSelectedNotes(selectedNoteIds, prevNotes.pages)
        return {...prevNotes, pages: filteredPages}
      })
      return { previousNotes }
    },

    onError: (err, newNotes, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
    },
  
  }) 


  const deleteSelectedNotes = useMutation({
    mutationFn: () => {
      const promises = selectedNoteIds.map(noteId => {
        return deleteNote(noteId)
      });
      return Promise.all(promises);
    },
    onMutate: () => {
      const previousNotes = queryClient.getQueryData(['notes', currentLabel._id, query])

      queryClient.setQueryData(['notes', currentLabel._id, query], (prevNotes: {pages: NoteType[][]}) => {
        const filteredPages = removeSelectedNotes(selectedNoteIds, prevNotes.pages)
        return {...prevNotes, pages: filteredPages}
      })
      return { previousNotes }
    },

    onError: (err, newNotes, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
    },

  }) 


  const restoreSelectedNotes = useMutation({
    mutationFn: () => {
      const promises = selectedNoteIds.map(noteId => {
        return restoreOnNote(noteId)
      });
      return Promise.all(promises);
    },

    onMutate: () => {
      const previousNotes = queryClient.getQueryData(['notes', currentLabel._id, query])

      queryClient.setQueryData(['notes', currentLabel._id, query], (prevNotes: {pages: NoteType[][]}) => {
        const filteredPages = removeSelectedNotes(selectedNoteIds, prevNotes.pages)
        return {...prevNotes, pages: filteredPages}
      })
      return { previousNotes }
    },

    onError: (err, newNotes, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
    },
  })
  
  const copySelectedNotes = useMutation({
    mutationFn: () => {
      const promises = selectedNotes.map(note => {
        return createNote(note.labels, note.title, note.body);
      });
      return Promise.all(promises);
    },

    onMutate: () => {
      const previousNotes = queryClient.getQueryData(['notes', currentLabel._id, query])

      queryClient.setQueryData(['notes', currentLabel._id, query], (prevNotes: {pages: NoteType[][]}) => {
        const notesToAdd = selectedNotes.map(note => {
          return {...note, isPinned: false}
        })
        prevNotes.pages[prevNotes.pages.length - 1] = [...prevNotes.pages[prevNotes.pages.length - 1], ...notesToAdd]
        return prevNotes
      })
      return { previousNotes }
    },

    onError: (err, newNotes, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', currentLabel._id, query] })
    },
  })

  return {toggleSelectedNotesPin, trashSelectedNotes, archiveSelectedNotes, deleteSelectedNotes, restoreSelectedNotes, copySelectedNotes}
}



export default useMultiNoteMutation