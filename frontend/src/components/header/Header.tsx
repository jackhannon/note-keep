import React from 'react';
import { useNotes } from '../../context/NoteContext';
import DefaultHeader from './DefaultHeader';
import MultiSelectHead from './multiSelectHeaderComponents/MultiSelectHead';
import headerStyles from "./headerStyles.module.css";
import { useParams } from 'react-router';


const Header: React.FC = () => {
  const {selectedNotesState} = useNotes()
  const {modeOn: multiSelectModeOn} = selectedNotesState
  const {labelId} = useParams()
  console.log(labelId)

  return (
    <header>
      {!multiSelectModeOn ? (
        <DefaultHeader/>
      ) : (
        <MultiSelectHead/>
      )}
    </header>
  
  )
}

export default Header;