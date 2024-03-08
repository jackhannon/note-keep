import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import selectedNotesReducer, { SelectedNotesActions, TOGGLED_MODE_OFF, SelectedNotesReducerState } from "../reducers/selectedNotesReducer";
import { LabelType } from "../interfaces";
import { useLocation, useNavigate } from "react-router";

type GlobalProviderProps = {
  children: React.ReactNode;
}

type ContextType = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  handleClickWhileMultiSelect: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  dispatchSelectedNotes: React.Dispatch<SelectedNotesActions>;
  selectedNotesState: SelectedNotesReducerState;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentLabel: LabelType;
  handleSetLabel: (label: LabelType) => void
}


const GlobalContext = createContext({} as ContextType);

const useGlobalContext = () => {
  return useContext(GlobalContext)
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {

  const initialState: SelectedNotesReducerState = {
    notes: [],
    modeOn: false
  };
  
  const [selectedNotesState, dispatchSelectedNotes] = useReducer(selectedNotesReducer, initialState);
  const [query, setQuery] = useState("")

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [currentLabel, setCurrentLabel] = useState<LabelType>({title: "Notes", _id: "Notes"});
  
  const navigate = useNavigate()
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== `/${currentLabel._id}`) {
      navigate(`/${currentLabel._id}`);
    }
  }, [currentLabel._id, location.pathname, navigate]);

  function handleSetLabel(label: LabelType) {
    setCurrentLabel(label)
    dispatchSelectedNotes({type: TOGGLED_MODE_OFF})
    setQuery("")
    window.scrollTo(0, 0)
  }

  function handleClickWhileMultiSelect(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation()
  }

  const context: ContextType = {
    query,
    setQuery,
    handleClickWhileMultiSelect,
    dispatchSelectedNotes,
    selectedNotesState,
    isSidebarOpen,
    setIsSidebarOpen,
    currentLabel,
    handleSetLabel
  };

  return (
    <GlobalContext.Provider value={context}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalProvider, useGlobalContext };