import { createContext, useState, useContext } from "react";
import { LabelType } from "../interfaces";


interface LabelProviderProps {
  children: React.ReactNode;
}

interface ContextType {
  labels: LabelType[];
  setLabels: React.Dispatch<React.SetStateAction<LabelType[]>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentLabel: {title: string, _id: string};
  setCurrentLabel: React.Dispatch<React.SetStateAction<LabelType>>;
  updateLocalLabel: (id: string, newName: string) => void;
  createLocalLabel: (label: LabelType) => void;
  deleteLocalLabel: (id: string) => void;
}

const LabelContext = createContext({} as ContextType);

const useLabels = () => {
  return useContext(LabelContext)
}

const LabelProvider: React.FC<LabelProviderProps> = ({ children }) => {
  const [labels, setLabels] = useState<LabelType[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentLabel, setCurrentLabel] = useState<LabelType>({title: "Notes", _id: "Notes"})


  function updateLocalLabel(id: string, title: string) {
    setLabels(prevLabels => {
      return prevLabels.map(label => {
        if (label._id === id) {
          return {...label, title: title}
        }
        return label
      })
    })
  }

  function createLocalLabel(label: LabelType) {
    setLabels(prevLabels => {
      return [...prevLabels, label]
    })
  }

  function deleteLocalLabel(id: string) {
    setLabels(prevLabels => {
      return prevLabels.filter(label => label._id !== id)
    })
  }

  const context: ContextType = {
    labels,
    setLabels,
    isOpen,
    setIsOpen,
    currentLabel,
    setCurrentLabel,
    updateLocalLabel,
    createLocalLabel, 
    deleteLocalLabel
  };
  

  return (
    <LabelContext.Provider value={context}>
      {children}
    </LabelContext.Provider>
  );
};

export { LabelProvider, useLabels };