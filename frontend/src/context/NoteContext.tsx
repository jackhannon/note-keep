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
    window.scrollTo(0, 0)
  }

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