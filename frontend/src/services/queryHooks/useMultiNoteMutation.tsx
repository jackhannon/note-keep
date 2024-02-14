import { useMutation, useQueryClient, } from "@tanstack/react-query"
import { archiveOnNote, deleteNote, restoreOnNote, togglePinOnNote, trashOnNote } from "../noteServices"
import { useNotes } from "../../context/NoteContext"
import { useParams } from "react-router"
import {  NotesData } from "../../interfaces"
import { removeSelectedNotes } from "../optimisticUpdates"

export const useMultiNoteMutation = (selectedNotes) => {
  const queryClient = useQueryClient()
  const {setQueryData, getQueryData} = queryClient

  const {query} = useNotes()
  const {labelId} = useParams()

  const pinStatusToToggle = selectedNotes.some(note => note.isPinned)
  const selectedNoteIds = selectedNotes.map(note => note._id)


  const toggleSelectedNotesPin = useMutation({
    mutationFn: () => {
        return selectedNoteIds.forEach(noteId => {
          togglePinOnNote(noteId, !pinStatusToToggle)
        });
    },
    onMutate: () => {
      const previousNotes = getQueryData(['notes', labelId, query])

      setQueryData(['notes', labelId, query], (prevNotes: NotesData) => {
        let newPinnedNotes;
        let newPlainNotes;
        
        if (pinStatusToToggle) {
          const notesToUnpin = prevNotes.pinnedNotes
            .filter(note => selectedNoteIds.includes(note._id))
            .map(note => note.isPinned = false)
          newPinnedNotes = prevNotes.pinnedNotes.filter(note => !selectedNoteIds.includes(note._id))
          newPlainNotes = [...prevNotes.plainNotes, ...notesToUnpin]
        } else {
          const notesToPin = prevNotes.plainNotes
            .filter(note => selectedNoteIds.includes(note._id))
            .map(note => note.isPinned = true)
          newPinnedNotes = [...prevNotes.pinnedNotes, ...notesToPin]
          newPlainNotes = prevNotes.plainNotes.filter(note => !selectedNoteIds.includes(note._id))
        }
        return {pinnedNotes: newPinnedNotes, plainNotes: newPlainNotes}
      })
      return { previousNotes }
    },

    onError: (err, newNotes, context) => {
      setQueryData(['notes', labelId, query], context?.previousNotes)
    },
  }) 


  const trashSelectedNotes = useMutation({
    mutationFn: () => {
      return selectedNoteIds.forEach(noteId => {
        trashOnNote(noteId)
      });
    },
    onMutate: () => {
      const previousNotes = getQueryData(['notes', labelId, query])

      setQueryData(['notes', labelId, query], (prevNotes: NotesData) => {
        return removeSelectedNotes(selectedNoteIds, prevNotes)
      })
      return { previousNotes }
    },

    onError: (err, newNotes, context) => {
      setQueryData(['notes', labelId, query], context?.previousNotes)
    },
  }) 


  const archiveSelectedNotes = useMutation({
    mutationFn: () => {
      return selectedNoteIds.forEach(noteId => {
        archiveOnNote(noteId)
      });
    },
    onMutate: () => {
      const previousNotes = getQueryData(['notes', labelId, query])

      setQueryData(['notes', labelId, query], (prevNotes: NotesData) => {
        return removeSelectedNotes(selectedNoteIds, prevNotes)
      })
      return { previousNotes }
    },

    onError: (err, newNotes, context) => {
      setQueryData(['notes', labelId, query], context?.previousNotes)
    },
  }) 


  const deleteSelectedNotes = useMutation({
    mutationFn: () => {
      return selectedNoteIds.forEach(noteId => {
        deleteNote(noteId)
      });    
    },
    onMutate: () => {
      const previousNotes = getQueryData(['notes', labelId, query])

      setQueryData(['notes', labelId, query], (prevNotes: NotesData) => {
        return removeSelectedNotes(selectedNoteIds, prevNotes)
      })
      return { previousNotes }
    },

    onError: (err, newNotes, context) => {
      setQueryData(['notes', labelId, query], context?.previousNotes)
    },
  }) 


  const restoreSelectedNotes = useMutation({
    mutationFn: () => {
      return selectedNoteIds.forEach(noteId => {
        restoreOnNote(noteId)
      });    
    },
    onMutate: () => {
      const previousNotes = getQueryData(['notes', labelId, query])

      setQueryData(['notes', labelId, query], (prevNotes: NotesData) => {
        return removeSelectedNotes(selectedNoteIds, prevNotes)
      })
      return { previousNotes }
    },

    onError: (err, newNotes, context) => {
      setQueryData(['notes', labelId, query], context?.previousNotes)
    },
  })

  return {toggleSelectedNotesPin, trashSelectedNotes, archiveSelectedNotes, deleteSelectedNotes, restoreSelectedNotes}
}



export default useMultiNoteMutation