import React, { useState } from 'react';
import headerStyles from "./headerStyles.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars,faMapPin, faEllipsisVertical, faArchive, faX, faTrash, faTrashRestore, faUndo } from '@fortawesome/free-solid-svg-icons';
import { useNotes } from '../../context/NoteContext';
import SearchBar from './SearchBar';
import useMultiNoteMutation from '../../services/queryHooks/useMultiNoteMutation';
import { TOGGLED_MODE_OFF } from '../../reducers/selectedNotesReducer';
import ClickToggleableOptionsModal from '../ClickToggleableOptionsModal';


const Header: React.FC = () => {
  const {selectedNotesState, dispatchSelectedNotes, setIsSidebarOpen, isSidebarOpen, currentLabel} = useNotes()
  const {notes: selectedNotes, modeOn: multiSelectModeOn} = selectedNotesState

  const [optionsModalState, setOptionsModal] = useState<boolean>(false);

  const {toggleSelectedNotesPin, archiveSelectedNotes, trashSelectedNotes, deleteSelectedNotes, restoreSelectedNotes} = useMultiNoteMutation(selectedNotes)

  //if all notes are unpinned, pin all the notes.
  //if any note is pinned, unpin all the notes
  const handleToggleAllPins = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    toggleSelectedNotesPin.mutate()
  }


  const handleSelectedNotesArchive = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    archiveSelectedNotes.mutate()
  }

  const handleSelectedNotesTrash = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
    trashSelectedNotes.mutate()
  }

  const handleSelectedNotesDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    deleteSelectedNotes.mutate()
  }
  
  const handleSelectedNotesRestore = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    restoreSelectedNotes.mutate()
  }

  const handleSelectedNotesCopy = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.stopPropagation();
  }

  const handleMultiSelectCancel = () => {
    dispatchSelectedNotes({type: TOGGLED_MODE_OFF})
  }

  return (
    <header>
      {!multiSelectModeOn ? (
        <>
          <div className={headerStyles.left}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={headerStyles.icon}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            <div className={headerStyles.title}>Keeper++</div>
          </div>

          <div className={headerStyles.center}>
            <SearchBar key={currentLabel._id}/>
          </div>

          <div className={headerStyles.right}>
        
          </div>
        </>
      ) : (
      <>
        <div className={headerStyles.left}>
          <button onClick={() => handleMultiSelectCancel()} className={headerStyles.noteSelectBtn}>
            <FontAwesomeIcon icon={faX} /> 
          </button>

          <div className={headerStyles.title}>{selectedNotes.length} selected</div>
        </div>
        {/* determine which buttons to show depending on if we are in a hardcoded label */}
        {!["Trash", "Archive"].includes(String(currentLabel._id)) ? (
          <div className={headerStyles.right}>
            {location.pathname !== '/search/query' ? (
              <button 
                onClick={(e) => handleToggleAllPins(e)} 
                className={`${headerStyles.option} 
                            ${headerStyles.noteSelectBtn}
                            ${selectedNotes.every(note => note.isPinned) ? headerStyles.removePin : ""}`}
              >
                <FontAwesomeIcon icon={faMapPin} />
              </button>
            ) : null}

            <button onClick={(e) => handleSelectedNotesArchive(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faArchive} />
            </button>
            <button onClick={() => setOptionsModal(!optionsModalState)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
            {optionsModalState ? (
              <ClickToggleableOptionsModal setOptionsModal={setOptionsModal}>
                <li onClick={(e) => handleSelectedNotesTrash(e)}>Delete</li>
                <li onClick={(e) => handleSelectedNotesCopy(e)}>Make a copy</li>
              </ClickToggleableOptionsModal>
            ) : null}
          </div>
        ) : currentLabel._id === "Trash" ? (
          <div className={headerStyles.right}>
            <button onClick={(e) => handleSelectedNotesArchive(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faArchive} />
            </button>
            <button onClick={(e) => handleSelectedNotesDelete(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button onClick={(e) => handleSelectedNotesRestore(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faTrashRestore} />
            </button>
          </div>
        ) : (
          <div className={headerStyles.right}>
            <button onClick={(e) => handleSelectedNotesTrash(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button onClick={(e) => handleSelectedNotesRestore(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faUndo} />
            </button>
          </div>
        )}
        
      </>
      )}
    </header>
  
  )
}

export default Header;