import { createContext, useContext, useReducer, useState } from "react";
import selectedNotesReducer, { SelectedNotesActions, TOGGLED_MODE_OFF, SelectedNotesReducerState } from "../reducers/selectedNotesReducer";
import { LabelType } from "../interfaces";

type NoteProviderProps = {
  children: React.ReactNode;
}

type ContextType = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  dispatchSelectedNotes: React.Dispatch<SelectedNotesActions>;
  selectedNotesState: SelectedNotesReducerState;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentLabel: LabelType;
  handleSetLabel: (label: LabelType) => void
}


const NoteContext = createContext({} as ContextType);

const useNotes = () => {
  return useContext(NoteContext)
}

const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {

  const initialState: SelectedNotesReducerState = {
    notes: [],
    modeOn: false
  };

  
  
  const [selectedNotesState, dispatchSelectedNotes] = useReducer(selectedNotesReducer, initialState);
  const [query, setQuery] = useState("")

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [currentLabel, setCurrentLabel] = useState<LabelType>({title: "Notes", _id: "Notes"});
  
  function handleSetLabel(label: LabelType) {
    setCurrentLabel(label)
    dispatchSelectedNotes({type: TOGGLED_MODE_OFF})
  }



  
  // function updateLocalNoteLabels(note: NoteType) {
  //   setNotes(prevNotes => {
  //     if (note.isPinned) {
  //       const newPinnedNotes = prevNotes.pinnedNotes.map(prevNote => {
  //         return prevNote._id !== note._id ? prevNote : note
  //       })
  //       return {
  //         ...prevNotes,
  //         pinnedNotes: newPinnedNotes,
  //       }
  //     } else {
  //       const newPlainNotes = prevNotes.plainNotes.map(prevNote => {
  //         return prevNote._id !== note._id ? prevNote : note
  //       })
  //       return {
  //         ...prevNotes,
  //         plainNotes: newPlainNotes,
  //       }
  //     }
  //   })
  // }

  // function createLocalNote(note: NoteType) {
  //   setNotes(prevNotes => { 
  //     return {
  //       ...prevNotes,
  //       plainNotes: [note ,...prevNotes.plainNotes]
  //     }
  //   })
  // }



  const context: ContextType = {
    query,
    setQuery,
    dispatchSelectedNotes,
    selectedNotesState,
    isSidebarOpen,
    setIsSidebarOpen,
    currentLabel,
    handleSetLabel
  };

  return (
    <NoteContext.Provider value={context}>
      {children}
    </NoteContext.Provider>
  );
};

export { NoteProvider, useNotes };