import { useMutation, useQueryClient, } from "@tanstack/react-query"
import { archiveOnNote, createNote, deleteNote, restoreOnNote, togglePinOnNote, trashOnNote } from "./noteServices"
import { useParams } from "react-router"
import {  NotesData } from "../../../interfaces"
import { removeSelectedNotes } from "./optimisticUpdates"
import { useGlobalContext } from "../../../context/GlobalContext"

export const useMultiNoteMutation = (selectedNotes) => {
  const queryClient = useQueryClient()

  const {query} = useGlobalContext()
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
      const previousNotes = queryClient.getQueryData(['notes', labelId, query])
      queryClient.setQueryData(['notes', labelId, query], (prevNotes: NotesData) => {
        let newPinnedNotes;
        let newPlainNotes;
        
        if (pinStatusToToggle) {
          const notesToUnpin = prevNotes.pinnedNotes
            .filter(note => selectedNoteIds.includes(note._id))
            .map(note => {
              return {...note, isPinned: false}
            });
            
          newPinnedNotes = prevNotes.pinnedNotes.filter(note => !selectedNoteIds.includes(note._id));
          newPlainNotes = [...prevNotes.plainNotes, ...notesToUnpin];
          console.log(newPlainNotes)

        } else {
          const notesToPin = prevNotes.plainNotes
            .filter(note => selectedNoteIds.includes(note._id))
            .map(note => {
              return {...note, isPinned: true}
            });
            
          newPinnedNotes = [...prevNotes.pinnedNotes, ...notesToPin];
          newPlainNotes = prevNotes.plainNotes.filter(note => !selectedNoteIds.includes(note._id));
        }
        console.log(newPinnedNotes, newPlainNotes)
        return {pinnedNotes: newPinnedNotes, plainNotes: newPlainNotes}
      })
      return { previousNotes }
    },

    onError: (err, newNotes, context) => {
      queryClient.setQueryData(['notes', labelId, query], context?.previousNotes)
    },
  }) 


  const trashSelectedNotes = useMutation({
    mutationFn: () => {
      return selectedNoteIds.forEach(noteId => {
        trashOnNote(noteId)
      });
    },
    onMutate: () => {
      const previousNotes = queryClient.getQueryData(['notes', labelId, query])
      queryClient.setQueryData(['notes', labelId, query], (prevNotes: NotesData) => {
      console.log(prevNotes)
        return removeSelectedNotes(selectedNoteIds, prevNotes)
      })

      return { previousNotes }
    },

    onError: (err, newNotes, context) => {
      queryClient.setQueryData(['notes', labelId, query], context?.previousNotes)
    },
  }) 


  const archiveSelectedNotes = useMutation({
    mutationFn: () => {
      return selectedNoteIds.forEach(noteId => {
        archiveOnNote(noteId)
      });
    },
    onMutate: () => {
      const previousNotes = queryClient.getQueryData(['notes', labelId, query])

      queryClient.setQueryData(['notes', labelId, query], (prevNotes: NotesData) => {
        return removeSelectedNotes(selectedNoteIds, prevNotes)
      })
      return { previousNotes }
    },

    onError: (err, newNotes, context) => {
      queryClient.setQueryData(['notes', labelId, query], context?.previousNotes)
    },
  }) 


  const deleteSelectedNotes = useMutation({
    mutationFn: () => {
      return selectedNoteIds.forEach(noteId => {
        deleteNote(noteId)
      });    
    },
    onMutate: () => {
      const previousNotes = queryClient.getQueryData(['notes', labelId, query])

      queryClient.setQueryData(['notes', labelId, query], (prevNotes: NotesData) => {
        return removeSelectedNotes(selectedNoteIds, prevNotes)
      })
      return { previousNotes }
    },

    onError: (err, newNotes, context) => {
      queryClient.setQueryData(['notes', labelId, query], context?.previousNotes)
    },
  }) 


  const restoreSelectedNotes = useMutation({
    mutationFn: () => {
      return selectedNoteIds.forEach(noteId => {
        restoreOnNote(noteId)
      });    
    },

    onMutate: () => {
      const previousNotes = queryClient.getQueryData(['notes', labelId, query])

      queryClient.setQueryData(['notes', labelId, query], (prevNotes: NotesData) => {
        return removeSelectedNotes(selectedNoteIds, prevNotes)
      })
      return { previousNotes }
    },

    onError: (err, newNotes, context) => {
      queryClient.setQueryData(['notes', labelId, query], context?.previousNotes)
    },
  })
  
  const copySelectedNotes = useMutation({
    mutationFn: () => {
      return selectedNotes.forEach(note => {
        return createNote(note.labels, note.title, note.body);
      });    
    },

    onMutate: () => {
      const previousNotes = queryClient.getQueryData(['notes', labelId, query])

      queryClient.setQueryData(['notes', labelId, query], (prevNotes: NotesData) => {
        const pinnedSelectedNotes = prevNotes.pinnedNotes.filter(note => selectedNoteIds.includes(note._id));
        const plainSelectedNotes =  prevNotes.plainNotes.filter(note => selectedNoteIds.includes(note._id));

        return {...prevNotes, plainNotes: [...prevNotes.plainNotes, ...pinnedSelectedNotes, ...plainSelectedNotes]}
      })
      return { previousNotes }
    },

    onError: (err, newNotes, context) => {
      queryClient.setQueryData(['notes', labelId, query], context?.previousNotes)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', labelId, query] })
    },
  })

  return {toggleSelectedNotesPin, trashSelectedNotes, archiveSelectedNotes, deleteSelectedNotes, restoreSelectedNotes, copySelectedNotes}
}



export default useMultiNoteMutation