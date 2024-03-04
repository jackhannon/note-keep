import React from 'react';
import DefaultHeader from './DefaultHeader';
import MultiSelectHead from './MultiSelectHeader';
import { useGlobalContext } from '../../../context/GlobalContext';


const Header: React.FC = () => {
  const {selectedNotesState} = useGlobalContext()
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