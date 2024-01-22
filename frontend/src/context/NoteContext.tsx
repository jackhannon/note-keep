import { createContext, useState, useContext } from "react";
import { NoteType,  notesState } from "../interfaces";

interface NoteProviderProps {
  children: React.ReactNode;
}


type ContextType = {
  notes: notesState;
  setNotes: React.Dispatch<React.SetStateAction<notesState>>;
  selectedNotes: NoteType[];
  setSelectedNotes: React.Dispatch<React.SetStateAction<NoteType[]>>;
  multiSelectMode: boolean;
  setMultiSelectMode: React.Dispatch<React.SetStateAction<boolean>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  updateLocalNote: (note: NoteType) => void;
  createLocalNote: (note: NoteType) => void;
  deleteLocalNote: (note: NoteType) => void
  updateLocalNoteLabels: (note: NoteType) => void;
}

const NoteContext = createContext({} as ContextType);

const useNotes = () => {
  return useContext(NoteContext)
}

const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<notesState>({
    plainNotes: [],
    pinnedNotes: [],
  });
  const [multiSelectMode, setMultiSelectMode] = useState<boolean>(false);
  const [selectedNotes, setSelectedNotes] = useState<NoteType[]>([]);
  const [query, setQuery] = useState<string>("")


  function updateLocalNote(note: NoteType) {
    setNotes(prevNotes => {
      if (note.isPinned) {
        const pinnedNoteIds = {}

        for (let i = 0; i < prevNotes.pinnedNotes.length; i++) {
          const currentId = prevNotes.pinnedNotes[i]._id
          pinnedNoteIds[currentId] ? pinnedNoteIds[currentId]++ : pinnedNoteIds[currentId] = 1
        }

        if (pinnedNoteIds[note._id]) {
          prevNotes.pinnedNotes = prevNotes.pinnedNotes.map(prevNote => {
            if (prevNote._id === note._id) {
              return note
            }
            return prevNote
          })
        } else {
          prevNotes.pinnedNotes.push(note)
          prevNotes.plainNotes = prevNotes.plainNotes.filter(prevNote => prevNote._id !== note._id)
        }
      } else {
        const plainNoteIds = {};

        for (let i = 0; i < prevNotes.plainNotes.length; i++) {
          const currentId = prevNotes.plainNotes[i]._id
          plainNoteIds[currentId] ?plainNoteIds[currentId]++ : plainNoteIds[currentId] = 1
        }
        if (plainNoteIds[note._id]) {
          prevNotes.plainNotes = prevNotes.plainNotes.map(prevNote => {
            if (prevNote._id === note._id) {
              return note
            }
            return prevNote
          })
        } else {
          prevNotes.pinnedNotes = prevNotes.pinnedNotes.filter(prevNote => prevNote._id !== note._id)
          prevNotes.plainNotes.push(note)
        }
      }
      return {
        pinnedNotes: prevNotes.pinnedNotes,
        plainNotes: prevNotes.plainNotes,
      }
    })
  }

  function updateLocalNoteLabels(note: NoteType) {
    setNotes(prevNotes => {
      if (note.isPinned) {
        const newPinnedNotes = prevNotes.pinnedNotes.map(prevNote => {
          return prevNote._id !== note._id ? prevNote : note
        })
        return {
          ...prevNotes,
          pinnedNotes: newPinnedNotes,
        }
      } else {
        const newPlainNotes = prevNotes.plainNotes.map(prevNote => {
          return prevNote._id !== note._id ? prevNote : note
        })
        return {
          ...prevNotes,
          plainNotes: newPlainNotes,
        }
      }
    })
  }

  function createLocalNote(note: NoteType) {
    setNotes(prevNotes => { 
      return {
        ...prevNotes,
        plainNotes: [note ,...prevNotes.plainNotes]
      }
    })
  }

  function deleteLocalNote(note: NoteType) {
    setNotes(prevNotes => {
      if (note?.isPinned) {
        const newPinnedNotes = prevNotes.pinnedNotes.filter(prevNote => prevNote._id !== note._id) 
        return {
          ...prevNotes,
          pinnedNotes: newPinnedNotes
        }
      } else {
        const newPlainNotes = prevNotes.plainNotes.filter(prevNote => prevNote._id !== note._id) 
        return {
          ...prevNotes,
          plainNotes: newPlainNotes
        }
      }
    })
  }

  const context: ContextType = {
    notes,
    setNotes,
    selectedNotes,
    setSelectedNotes,
    multiSelectMode,
    setMultiSelectMode,
    query,
    setQuery,
    updateLocalNote,
    createLocalNote,
    deleteLocalNote,
    updateLocalNoteLabels,
  };

  return (
    <NoteContext.Provider value={context}>
      {children}
    </NoteContext.Provider>
  );
};

export { NoteProvider, useNotes };