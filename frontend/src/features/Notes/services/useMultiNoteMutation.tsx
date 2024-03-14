import { useMutation, useQueryClient, } from "@tanstack/react-query"
import { archiveOnNote, createNote, deleteNote, restoreOnNote, togglePinOnNote, trashOnNote } from "./noteServices"
import {  NoteType } from "../../../interfaces"
import { removeSelectedNotes } from "./optimisticUpdates"
import { useGlobalContext } from "../../../context/GlobalContext"
import { findIndexWhereDateIsClosest } from "../../../utils/getIndexWhereDateIsClosest"

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

        const normalizedPages = prevNotes.pages.filter(page => page.length > 0)

        const pagesWithoutSelectedNotes = normalizedPages.map((page: NoteType[]) => {
          return page.filter((note: NoteType) => {
            return !selectedNoteIds.includes(note._id)
          });
        })

        const flattenedPagesWithoutSelectedNotes = pagesWithoutSelectedNotes.flat();

        let pinnedNotes = flattenedPagesWithoutSelectedNotes
        .filter(note => note.isPinned);

        const unpinnedNotes = flattenedPagesWithoutSelectedNotes
        .filter(note => !note.isPinned);
        
        const notesToAdd = selectedNotes.map(note =>  {
          return {...note, isPinned: !pinStatusToToggle}
        })

        if (pinStatusToToggle) {
          notesToAdd.forEach(note => {
            const indexToInsertAt = findIndexWhereDateIsClosest(unpinnedNotes, note.date)
            unpinnedNotes.splice(indexToInsertAt, 0, {...note})
          })
        } else {
          pinnedNotes = notesToAdd.concat(pinnedNotes)
        }
        
        const allNotes = pinnedNotes.concat(unpinnedNotes)
        const newPages: NoteType[][] = []
        for (let i = 0; i < allNotes.length; i++) {
          if (i % 39 === 0) {
            newPages.push([])
          }
          newPages[newPages.length-1].push(allNotes[i])
        }
        return {...prevNotes, pages: [...newPages]}
      })
      return { previousNotes }
    },

    onError: (_err, _newNotes, context) => {
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

    onError: (_err, _newNotes, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', currentLabel._id, query] })
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

    onError: (_err, _newNotes, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', currentLabel._id, query] })
    }
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

    onError: (_err, _newNotes, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', currentLabel._id, query] })
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

    onError: (_err, _newNotes, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', currentLabel._id, query] })
    }
  })
  
  
  const copySelectedNotes = useMutation({
    mutationFn: () => {
      const promises = selectedNotes.map(note => {
        return createNote(false, Date.now(), note.labels, note.title, note.body);
      });
      return Promise.all(promises);
    },
    onMutate: () => {
      const previousNotes = queryClient.getQueryData(['notes', currentLabel._id, query])

      queryClient.setQueryData(['notes', currentLabel._id, query], (prevNotes: {pages: NoteType[][]}) => {
        let firstPageWithUnpinnedNote = -1
        let firstPositionWithUnpinnedNote = -1
        
        const normalizedPages = prevNotes.pages.filter(page => page.length > 0)

        const pages = normalizedPages.map((page, pageIndex) => {
          return page.map((note, noteIndex) => {
            if (!note.isPinned && firstPageWithUnpinnedNote === -1) {
              firstPageWithUnpinnedNote = pageIndex
              firstPositionWithUnpinnedNote = noteIndex
            }
            return note
          });
        })
        
        const flattenedPages = pages.flat();

        if (firstPageWithUnpinnedNote < 0 && firstPositionWithUnpinnedNote < 0) {
          const lastPageIndex = pages.length - 1;
          firstPageWithUnpinnedNote = lastPageIndex;
        
          const lastPage = pages[lastPageIndex];
          firstPositionWithUnpinnedNote = lastPage.length;
        }
        const normalizedUnpinnedNotePosition = ((firstPositionWithUnpinnedNote + 1) * (firstPageWithUnpinnedNote + 1)) - 1

        const pinnedNotes = flattenedPages
        .slice(0, normalizedUnpinnedNotePosition);

        let unpinnedNotes = flattenedPages
        .slice(normalizedUnpinnedNotePosition);

        const notesToAdd = selectedNotes.map(note => {
          return {...note, isPinned: false}
        })
        unpinnedNotes = notesToAdd.concat(unpinnedNotes)
        
        const allNotes = pinnedNotes.concat(unpinnedNotes)
        const newPages: NoteType[][] = []
        for (let i = 0; i < allNotes.length; i++) {
          if (i % 40 === 0) {
            newPages.push([])
          }
          newPages[newPages.length-1].push(allNotes[i])
        }
        return {...prevNotes, pages: [...newPages]}
      })
      return { previousNotes }
    },

    onError: (_err, _newNotes, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', currentLabel._id, query] })
    }
  })

  return {toggleSelectedNotesPin, trashSelectedNotes, archiveSelectedNotes, deleteSelectedNotes, restoreSelectedNotes, copySelectedNotes}
}



export default useMultiNoteMutation