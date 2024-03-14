import { useMutation, useQueryClient, } from "@tanstack/react-query"
import { archiveOnNote, createNote, deleteNote, restoreOnNote, togglePinOnNote, trashOnNote, updateNoteContents, updateNoteLabels,} from "./noteServices"
import { NoteType } from "../../../interfaces"
import { removeNote } from "./optimisticUpdates"
import { useGlobalContext } from "../../../context/GlobalContext"
import { findIndexWhereDateIsClosest } from "../../../utils/getIndexWhereDateIsClosest"

const useSingleNoteMutation = (boundNote: NoteType = {_id: "", labels: [], isPinned: false, isTrashed:  false, isArchived:  false, date: 0}) => {
  const queryClient = useQueryClient()
  const {query, currentLabel} = useGlobalContext()

  
  const toggleNotePin = useMutation({
    mutationFn: () => togglePinOnNote(boundNote._id, !boundNote.isPinned),
    onMutate: () => {
      const previousNotes = queryClient.getQueryData(['notes', currentLabel._id, query]);
      queryClient.setQueryData(['notes', currentLabel._id, query], (prevNotes: {pages: NoteType[][]}) => { 
        const normalizedPages = prevNotes.pages.filter(page => page.length > 0)

        const pagesWithoutBoundNote = normalizedPages.map((page) => {
          return page.filter((note) => {
            return note._id !== boundNote._id
          });
        })

        const flattenedPagesWithoutBoundNote = pagesWithoutBoundNote.flat();
        
        const pinnedNotes = flattenedPagesWithoutBoundNote
        .filter(note => note.isPinned);

        const unpinnedNotes = flattenedPagesWithoutBoundNote
        .filter(note => !note.isPinned);

        const indexToInsertAt = 
        boundNote.isPinned 
        ? findIndexWhereDateIsClosest(unpinnedNotes, boundNote.date) 
        : 0;

        if (boundNote.isPinned) {
          unpinnedNotes.splice(indexToInsertAt, 0, {...boundNote, isPinned: false})
        } else {
          pinnedNotes.splice(indexToInsertAt, 0, {...boundNote, isPinned: true})
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

  
  const noteArchive = useMutation({
    mutationFn: () => {
      return archiveOnNote(boundNote._id)
    },
    onMutate: () => {
      const previousNotes = queryClient.getQueryData(['notes', currentLabel._id, query])
      
      queryClient.setQueryData(['notes', currentLabel._id, query], (prevNotes: {pages: NoteType[][]}) => {

        const filteredPages = removeNote(boundNote._id, prevNotes.pages)
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


  const noteTrash = useMutation({
    mutationFn: () => {
      return trashOnNote(boundNote._id)
    },
    onMutate: () => {
      const previousNotes = queryClient.getQueryData(['notes', currentLabel._id, query])

      queryClient.setQueryData(['notes', currentLabel._id, query], (prevNotes:  {pages: NoteType[][]}) => {
        const filteredPages = removeNote(boundNote._id, prevNotes.pages)
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


  const noteRestore = useMutation({
    mutationFn: () => {
      return restoreOnNote(boundNote._id)
    },
    onMutate: () => {
      const previousNotes = queryClient.getQueryData(['notes', currentLabel._id, query])
      queryClient.setQueryData(['notes', currentLabel._id, query], (prevNotes:  {pages: NoteType[][]}) => {

        const filteredPages = removeNote(boundNote._id, prevNotes.pages)
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


  const noteDelete = useMutation({
    mutationFn: () => {
      return deleteNote(boundNote._id)
    },
    onMutate: () => {
      const previousNotes = queryClient.getQueryData(['notes', currentLabel._id, query])
      
      queryClient.setQueryData(['notes', currentLabel._id, query], (prevNotes: {pages: NoteType[][]}) => {
        const filteredPages = removeNote(boundNote._id, prevNotes.pages)
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


  type NotesDetails = {
    title?: string;
    body?: string;
    labels: string[];
    date: number
    isPinned: boolean
  }

  const noteCreate = useMutation({
    mutationFn: (content: NotesDetails) => {
      return createNote(content.isPinned, content.date, content.labels, content.title, content.body);
    },
    onMutate: (content) => {
      const previousNotes = queryClient.getQueryData(['notes', currentLabel._id, query]);
      
      queryClient.setQueryData(['notes', currentLabel._id, query], (prevNotes:  {pages: NoteType[][]}) => {
        let firstPositionWithUnpinnedNote = -1;
        let firstPageWithUnpinnedNote = -1
        
        prevNotes.pages.forEach((page, pageIndex)=> {
          const doesPositionWithNoPinExist = page.some((note, noteIndex) => {
            if (!note.isPinned) {
              firstPositionWithUnpinnedNote = noteIndex
              return true
            }
            return false
          })
          if (doesPositionWithNoPinExist) {
            firstPageWithUnpinnedNote = pageIndex
          }
        })

        if (firstPageWithUnpinnedNote <= -1) {
          firstPageWithUnpinnedNote = prevNotes.pages.length - 1
        }

        if (firstPositionWithUnpinnedNote <= -1) {
          firstPositionWithUnpinnedNote = prevNotes.pages[firstPageWithUnpinnedNote].length
        }

        const pagesCopy = prevNotes.pages.map(page => {
          return page.map(note => {
            return {...note};
          })
        })

        pagesCopy[firstPageWithUnpinnedNote].splice(firstPositionWithUnpinnedNote, 0, {title: content.title, body: content.body, labels: content.labels, isPinned: false, isArchived: false, isTrashed: false, _id: "1", date: Date.now()})
        return {...prevNotes, pages: pagesCopy}
      });
      return { previousNotes };
    },
    onError: (_err, _newNotes, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', currentLabel._id, query] })
    },
  })


  type NoteContents = {
    title: string;
    body: string;
  }

  const noteContentUpdate = useMutation({
    mutationFn: (contents: NoteContents) => {
      return updateNoteContents(boundNote._id, contents.title, contents.body)
    },
    onMutate: (contents) => {

      const previousNotes = queryClient.getQueryData(['notes', currentLabel._id, query])
      queryClient.setQueryData(['notes',currentLabel._id, query], (prevNotes: {pages: NoteType[][]}) => {

        const newPages = prevNotes.pages.map(page => {
          return page.map((note) => {
            if (note._id === boundNote._id) {
              return {...note, body: contents.body, title: contents.title}
            }
            return note
          })
        })
        return {...prevNotes, pages: newPages}
      })
      return { previousNotes }
    },
    onError: (_err, _newNotes, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
    },
  })

  const noteLabelUpdate = useMutation({
    mutationFn: (labels: string[]) => {
      return updateNoteLabels(boundNote._id, labels)
    },
    onMutate: (labels) => {
      const previousNotes = queryClient.getQueryData(['notes', currentLabel._id, query])
      queryClient.setQueryData(['notes', currentLabel._id, query], (prevNotes: {pages: NoteType[][]}) => {
        if (!labels.some(label => label === currentLabel._id) && currentLabel._id !== "Notes") {
          const filteredPages = removeNote(boundNote._id, prevNotes.pages);
          return {...prevNotes, pages: filteredPages}
        }
        const newPages = prevNotes.pages.map(page => {
          return page.map(note => {
            if (note._id === boundNote._id) {
              return {...note, labels: labels}
            }
            return note
          })
        }) 
        return {...prevNotes, pages: newPages}
      })
      return { previousNotes }
    },
    onError: (_err, _newPages, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
    },
  })

  return {toggleNotePin, noteTrash, noteArchive, noteRestore, noteDelete, noteContentUpdate, noteLabelUpdate, noteCreate}
}



export default useSingleNoteMutation