import React, { useRef, useState } from 'react'
import { useNotes } from '../../../context/NoteContext';
import useMultiNoteMutation from '../../../services/queryHooks/useMultiNoteMutation';
import { TOGGLED_MODE_OFF } from '../../../reducers/selectedNotesReducer';
import headerStyles from "../headerStyles.module.css";
import optionModalStyles from '../../optionModalStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin, faEllipsisVertical, faArchive, faX, faTrash, faTrashRestore, faUndo } from '@fortawesome/free-solid-svg-icons';
import useClickOutside from '../../../hooks/useClickOutside';

const MultiSelectHead = () => {
  const {selectedNotesState, dispatchSelectedNotes, currentLabel} = useNotes()

  const {notes: selectedNotes} = selectedNotesState

  const [optionsModalState, setOptionsModal] = useState<boolean>(false);

  const {toggleSelectedNotesPin, archiveSelectedNotes, trashSelectedNotes, deleteSelectedNotes, restoreSelectedNotes, copySelectedNotes} = useMultiNoteMutation(selectedNotes)


  const handleClickOutsideOptionModal = () => {
    setOptionsModal(false)
  }
  const optionsModalRef = useRef<HTMLUListElement>(null)
  
  useClickOutside(optionsModalRef, handleClickOutsideOptionModal)

  //if all notes are unpinned, pin all the notes.
  //if any note is pinned, unpin all the notes
  const handleToggleAllPins = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    toggleSelectedNotesPin.mutate()
    dispatchSelectedNotes({type: TOGGLED_MODE_OFF})
  }


  const handleSelectedNotesArchive = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    archiveSelectedNotes.mutate()
    dispatchSelectedNotes({type: TOGGLED_MODE_OFF})
  }

  const handleSelectedNotesTrash = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
    console.log(selectedNotes)
    trashSelectedNotes.mutate()
    dispatchSelectedNotes({type: TOGGLED_MODE_OFF})
  }

  const handleSelectedNotesDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    deleteSelectedNotes.mutate()
    dispatchSelectedNotes({type: TOGGLED_MODE_OFF})
  }
  
  const handleSelectedNotesRestore = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    restoreSelectedNotes.mutate()
    dispatchSelectedNotes({type: TOGGLED_MODE_OFF})
  }

  const handleSelectedNotesCopy = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.stopPropagation();
    copySelectedNotes.mutate()
    dispatchSelectedNotes({type: TOGGLED_MODE_OFF})

  }

  const handleMultiSelectCancel = () => {
    dispatchSelectedNotes({type: TOGGLED_MODE_OFF})
  }

  return (
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
          <button 
            onClick={(e) => handleToggleAllPins(e)} 
            className={`${headerStyles.option} 
                        ${headerStyles.noteSelectBtn}
                        ${selectedNotes.every(note => note.isPinned) ? headerStyles.removePin : ""}`}
          >
            <FontAwesomeIcon icon={faMapPin} />
          </button>
          <button onClick={(e) => handleSelectedNotesArchive(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
            <FontAwesomeIcon icon={faArchive} />
          </button>
          <button onClick={() => setOptionsModal(!optionsModalState)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>
          {optionsModalState && (
            <ul className={`${optionModalStyles.modal} ${optionModalStyles.headerModal}`} ref={optionsModalRef}>
              <li onClick={(e) => handleSelectedNotesTrash(e)}>Delete</li>
              <li onClick={(e) => handleSelectedNotesCopy(e)}>Make a copy</li>
            </ul>
          )}
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
  )
}

export default MultiSelectHead