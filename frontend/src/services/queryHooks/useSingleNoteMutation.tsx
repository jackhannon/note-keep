import { useMutation, useQueryClient, } from "@tanstack/react-query"
import { archiveOnNote, deleteNote, restoreOnNote, togglePinOnNote, trashOnNote, updateNoteContents, updateNoteLabels,} from "../noteServices"
import { useNotes } from "../../context/NoteContext"
import { useParams } from "react-router"
import { LabelType, NoteType, NotesData } from "../../interfaces"
import { removeNote } from "../optimisticUpdates"

const useSingleNoteMutation = (boundNote: NoteType) => {
  const queryClient = useQueryClient()
  const {setQueryData, getQueryData} = queryClient
  const {query, currentLabel} = useNotes()
  const {labelId} = useParams()

  
  const toggleNotePin = useMutation({
    
    mutationFn: () => togglePinOnNote(boundNote._id, !boundNote.isPinned),
    onMutate: () => {
      const previousNotes = getQueryData(['notes', labelId, query]);
      setQueryData(['notes', labelId, query], (prevNotes: NotesData) => {
        if (boundNote.isPinned) {
          const newPinnedNotes = prevNotes.pinnedNotes.filter(note => note._id !== boundNote._id);
          const newPlainNotes = [...prevNotes.plainNotes, {...boundNote, isPinned: false}];
          return {pinnedNotes: newPinnedNotes, plainNotes: newPlainNotes};
        } else {
          const newPlainNotes = prevNotes.plainNotes.filter(note => note._id !== boundNote._id);
          const newPinnedNotes = [...prevNotes.pinnedNotes, {...boundNote, isPinned: true}];
          return {pinnedNotes: newPinnedNotes, plainNotes: newPlainNotes};
        }
      })
      return { previousNotes }
    },
    onError: (err, newNotes, context) => {
      setQueryData(['notes', labelId, query], context?.previousNotes)
    }
  })

  
  const noteArchive = useMutation({
    mutationFn: () => {
      return archiveOnNote(boundNote._id)
    },
    onMutate: () => {
      const previousNotes = getQueryData(['notes', labelId, query])
      
      setQueryData(['notes', labelId, query], (prevNotes: NotesData) => {
        return removeNote(boundNote._id, prevNotes)
      })
      return { previousNotes }
    },
    onError: (err, newNotes, context) => {
      setQueryData(['notes', labelId, query], context?.previousNotes)
    },
  })


  const noteTrash = useMutation({
    mutationFn: () => {
      return trashOnNote(boundNote._id)
    },
    onMutate: () => {
      const previousNotes = getQueryData(['notes', labelId, query])
      
      setQueryData(['notes', labelId, query], (prevNotes: NotesData) => {
        return removeNote(boundNote._id, prevNotes)
      })
      return { previousNotes }
    },
    onError: (err, newNotes, context) => {
      setQueryData(['notes', labelId, query], context?.previousNotes)
    },
  })


  const noteRestore = useMutation({
    mutationFn: () => {
      return restoreOnNote(boundNote._id)
    },
    onMutate: () => {
      const previousNotes = getQueryData(['notes', labelId, query])
      
      setQueryData(['notes', labelId, query], (prevNotes: NotesData) => {
        return removeNote(boundNote._id, prevNotes)
      })
      return { previousNotes }
    },
    onError: (err, newNotes, context) => {
      setQueryData(['notes', labelId, query], context?.previousNotes)
    },
  })


  const noteDelete = useMutation({
    mutationFn: () => {
      return deleteNote(boundNote._id)
    },
    onMutate: () => {
      const previousNotes = getQueryData(['notes', labelId, query])
      
      setQueryData(['notes', labelId, query], (prevNotes: NotesData) => {
        return removeNote(boundNote._id, prevNotes)
      })
      return { previousNotes }
    },
    onError: (err, newNotes, context) => {
      setQueryData(['notes', labelId, query], context?.previousNotes)
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
    onMutate: () => {
      const previousNotes = getQueryData(['notes', labelId, query])
      
      setQueryData(['notes', labelId, query], (prevNotes: NotesData) => {
        return removeNote(boundNote._id, prevNotes)
      })
      return { previousNotes }
    },
    onError: (err, newNotes, context) => {
      setQueryData(['notes', labelId, query], context?.previousNotes)
    },
  })

  
  const noteLabelUpdate = useMutation({
    mutationFn: (labels: LabelType[]) => {
      return updateNoteLabels(boundNote._id, labels)
    },
    onMutate: (labels) => {
      const previousNotes = getQueryData(['notes', labelId, query])
      
      setQueryData(['notes', labelId, query], (prevNotes: NotesData) => {
        if (!labels.some(label => label._id === currentLabel._id)) {
          return removeNote(boundNote._id, prevNotes);
        }
        const noteInPinnedNotes = prevNotes.pinnedNotes.find(note => note._id === boundNote._id);
        if (noteInPinnedNotes) {
          const pinnedNotes = prevNotes.pinnedNotes.map(note => {
            if (note._id === boundNote._id) {
              return {...note, labels: labels}
            }
            return note
          })
          return {...pinnedNotes, ...prevNotes.plainNotes}
        } else {
          const plainNotes = prevNotes.pinnedNotes.map(note => {
            if (note._id === boundNote._id) {
              return {...note, labels: labels}
            }
            return note
          })
          return {...prevNotes.pinnedNotes, ...plainNotes}
        }       
      })
      return { previousNotes }
    },
    onError: (err, newNotes, context) => {
      setQueryData(['notes', labelId, query], context?.previousNotes)
    },
  })

  return {toggleNotePin, noteTrash, noteArchive, noteRestore, noteDelete, noteContentUpdate, noteLabelUpdate}
}



export default useSingleNoteMutation