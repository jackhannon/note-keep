import React from 'react';
import { useNotes } from '../../context/NoteContext';
import DefaultHeader from './DefaultHeader';
import MultiSelectHead from './multiSelectHeaderComponents/MultiSelectHead';


const Header: React.FC = () => {
  const {selectedNotesState} = useNotes()
  const {modeOn: multiSelectModeOn} = selectedNotesState



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