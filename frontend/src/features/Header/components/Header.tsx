import React from 'react';
import DefaultHeader from './DefaultHeader';
import MultiSelectHead from './MultiSelectHeader';
import { useParams } from 'react-router';
import { useGlobalContext } from '../../../context/GlobalContext';


const Header: React.FC = () => {
  const {selectedNotesState} = useGlobalContext()
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