import { useMutation, useQueryClient, } from "@tanstack/react-query"
import { archiveOnNote, createNote, deleteNote, restoreOnNote, togglePinOnNote, trashOnNote, updateNoteContents, updateNoteLabels,} from "./noteServices"
import { NoteType } from "../../../interfaces"
import { removeNote } from "./optimisticUpdates"
import { useGlobalContext } from "../../../context/GlobalContext"

const useSingleNoteMutation = (boundNote: NoteType = {_id: "", labels: [], isPinned: false, isTrashed:  false, isArchived:  false}) => {
  const queryClient = useQueryClient()
  const {query, currentLabel} = useGlobalContext()

  
  const toggleNotePin = useMutation({
    mutationFn: () => togglePinOnNote(boundNote._id, !boundNote.isPinned),
    onMutate: () => {
      const previousNotes = queryClient.getQueryData(['notes', currentLabel._id, query]);
      queryClient.setQueryData(['notes', currentLabel._id, query], (prevNotes: {pages: NoteType[][]}) => {
        
        let notePageLocation = 0
        const filteredPages = prevNotes.pages.map((page, pageIndex) => {
          return page.filter(note => {
            if (note._id === boundNote._id) {
              notePageLocation = pageIndex
            }
            return note._id !== boundNote._id
          });
        })
        if (boundNote.isPinned) {
          filteredPages[notePageLocation].push({...boundNote, isPinned: false})
        } else {
          filteredPages[notePageLocation].unshift({...boundNote, isPinned: true})
        }
        return {...prevNotes, pages: filteredPages};
      })
      return { previousNotes }
    },
    onError: (err, newNotes, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
    }
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
    onError: (err, newNotes, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
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
    onError: (err, newNotes, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
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
    onError: (err, newNotes, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
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
    onError: (err, newNotes, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
    },
  })


  type NotesDetails = {
    title?: string;
    body?: string;
    labels: string[]
  }

  const noteCreate = useMutation({
    mutationFn: (content: NotesDetails) => {
      return createNote(content.labels, content.title, content.body);
    },
    onMutate: (content) => {
      const previousNotes = queryClient.getQueryData(['notes', currentLabel._id, query]);
      
      queryClient.setQueryData(['notes', currentLabel._id, query], (prevNotes:  {pages: NoteType[][]}) => {
        prevNotes.pages[prevNotes.pages.length - 1].push({title: content.title, body: content.body, labels: content.labels, isPinned: false, isArchived: false, isTrashed: false, _id: "1"})
        return prevNotes;
      });
      return { previousNotes };
    },
    onError: (err, newNotes, context) => {
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
    onError: (err, newNotes, context) => {
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
    onError: (err, newPages, context) => {
      queryClient.setQueryData(['notes', currentLabel._id, query], context?.previousNotes)
    },
  })

  return {toggleNotePin, noteTrash, noteArchive, noteRestore, noteDelete, noteContentUpdate, noteLabelUpdate, noteCreate}
}



export default useSingleNoteMutation