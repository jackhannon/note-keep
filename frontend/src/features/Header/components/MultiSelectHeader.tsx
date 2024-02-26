import React, { useRef, useState } from 'react'
import useMultiNoteMutation from '../../Notes/services/useMultiNoteMutation';
import { TOGGLED_MODE_OFF } from '../../../reducers/selectedNotesReducer';
import headerStyles from "../styles/headerStyles.module.css";
import optionModalStyles from '../../../styles/optionModalStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin, faEllipsisVertical, faArchive, faX, faTrash, faTrashRestore, faUndo } from '@fortawesome/free-solid-svg-icons';
import useClickOutside from '../../../hooks/useClickOutside';
import { useGlobalContext } from '../../../context/GlobalContext';

const MultiSelectHead = () => {
  const {selectedNotesState, dispatchSelectedNotes, currentLabel} = useGlobalContext()

  const {notes: selectedNotes} = selectedNotesState

  const [optionsModalState, setOptionsModal] = useState<boolean>(false);

  const {toggleSelectedNotesPin, archiveSelectedNotes, trashSelectedNotes, deleteSelectedNotes, restoreSelectedNotes, copySelectedNotes} = useMultiNoteMutation(selectedNotes)


  const handleClickOutsideOptionModal = () => {
    setOptionsModal(false)
  }
  const optionsModalRef = useRef<HTMLDivElement>(null)
  
  useClickOutside(optionsModalRef, handleClickOutsideOptionModal)

  //if all notes are unpinned, pin all the notes.
  //if any note is pinned, unpin all the notes
  const handleToggleAllPins = async () => {
    toggleSelectedNotesPin.mutate()
    dispatchSelectedNotes({type: TOGGLED_MODE_OFF})
  }


  const handleSelectedNotesArchive = () => {
    archiveSelectedNotes.mutate()
    dispatchSelectedNotes({type: TOGGLED_MODE_OFF})
  }

  const handleSelectedNotesTrash = () => {
    trashSelectedNotes.mutate()
    dispatchSelectedNotes({type: TOGGLED_MODE_OFF})
  }

  const handleSelectedNotesDelete = () => {
    deleteSelectedNotes.mutate()
    dispatchSelectedNotes({type: TOGGLED_MODE_OFF})
  }
  
  const handleSelectedNotesRestore = () => {
    restoreSelectedNotes.mutate()
    dispatchSelectedNotes({type: TOGGLED_MODE_OFF})
  }

  const handleSelectedNotesCopy = () => {
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
            onClick={handleToggleAllPins} 
            className={`${headerStyles.option} 
                        ${headerStyles.noteSelectBtn}
                        ${selectedNotes.every(note => note.isPinned) ? headerStyles.removePin : ""}`}
          >
            <FontAwesomeIcon icon={faMapPin} />
          </button>
          <button onClick={handleSelectedNotesArchive} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
            <FontAwesomeIcon icon={faArchive} />
          </button>
          <button onClick={() => setOptionsModal(!optionsModalState)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>
          {optionsModalState && (
            <div className={`${optionModalStyles.modal} ${optionModalStyles.headerModal}`} ref={optionsModalRef}>
              <button className={optionModalStyles.modalBtn} onClick={handleSelectedNotesTrash}>Delete</button>
              <button className={optionModalStyles.modalBtn} onClick={handleSelectedNotesCopy}>Make a copy</button>
            </div>
          )}
        </div>
      ) : currentLabel._id === "Trash" ? (
        <div className={headerStyles.right}>
          <button onClick={handleSelectedNotesArchive} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
            <FontAwesomeIcon icon={faArchive} />
          </button>
          <button onClick={handleSelectedNotesDelete} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <button onClick={handleSelectedNotesRestore} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
            <FontAwesomeIcon icon={faTrashRestore} />
          </button>
        </div>
      ) : (
        <div className={headerStyles.right}>
          <button onClick={handleSelectedNotesTrash} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <button onClick={handleSelectedNotesRestore} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
            <FontAwesomeIcon icon={faUndo} />
          </button>
        </div>
      )}
    </>
  )
}

export default MultiSelectHead