import React, { useEffect, useState,  } from 'react';
import headerStyles from "./headerStyles.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars,faMapPin, faEllipsisVertical, faArchive, faX, faTrash, faTrashRestore, faUndo } from '@fortawesome/free-solid-svg-icons';
import OptionsModal from '../main/Multiselect-components/OptionsModal';
import { useLabels } from '../../context/LabelContext';
import { useNotes } from '../../context/NoteContext';
import { updateNote, deleteNote } from '../../utils/notes';
import SearchBar from './SearchBar';
import { useAsyncFn } from '../../hooks/useAsync';



const Header: React.FC = () => {
  const {notes, setMultiSelectMode, multiSelectMode, selectedNotes, setSelectedNotes, deleteLocalNote, updateLocalNote, createLocalNote} = useNotes()
  const {setIsOpen, isOpen, currentLabel} = useLabels()
  const [modalState, setModalState] = useState<boolean>(false)

  const updateNoteState = useAsyncFn(updateNote)
  const deleteNoteState = useAsyncFn(deleteNote)
  
  useEffect(() => {
    if (multiSelectMode) {
      if (selectedNotes.length <= 0) {
        setMultiSelectMode(false)
      }
    }
  }, [selectedNotes])

  
  useEffect(() => {
    if (multiSelectMode) {
      setMultiSelectMode(false)
      setSelectedNotes([])
    }
  }, [currentLabel._id, notes, setSelectedNotes])

  
  const handleMultiSelectCancel = () => {
    setMultiSelectMode(false)
    setSelectedNotes([])
  }

  const handlePin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    selectedNotes.forEach((note) => {
      updateNoteState.execute({id: note._id, 
        options: {isPinned: true}
      }).then(note => {
        updateLocalNote(note)
      })
    })
  }

  const handleUnpin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    selectedNotes.forEach((note) => {
      updateNoteState.execute({id: note._id, 
        options: {isPinned: false}
      }).then(note => {
        updateLocalNote(note)
      })
    })
  }

  const handleArchive = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    selectedNotes.forEach((note) => {
      updateNoteState.execute({id: note._id, 
        options: {isArchived: true,
        isTrashed: false,}
      }).then(note => {
        deleteLocalNote(note)
      })
    })
  }

  const handleTrash = (e: React.MouseEvent<Element, MouseEvent>) => {
      e.stopPropagation();
      selectedNotes.forEach((note) => {
      updateNoteState.execute({id: note._id, 
        options: {isArchived: false,
          isTrashed: true}
      }).then(note => {
        deleteLocalNote(note)
      })
    })
  }

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    selectedNotes.forEach((note) => {
    deleteNoteState.execute(note._id)
    .then(note => {
      deleteLocalNote(note)
    })
  })
}
  
  const handleRestore = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    selectedNotes.forEach((note) => {
    updateNoteState.execute({id: note._id, 
      options: {isArchived: false,
        isTrashed: false}
    }).then(note => {
      deleteLocalNote(note)
    })
  })
}



  return (
    <header>
      {!multiSelectMode ? (
      <>
        <div className={headerStyles.left}>
          <button onClick={() => setIsOpen(!isOpen)} className={headerStyles.icon}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className={headerStyles.title}>Keeper++</div>
        </div>

        <div className={headerStyles.center}>
          <SearchBar />
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
        {!["Trash", "Archive"].includes(currentLabel._id || "") ? (
          <div className={headerStyles.right}>
            {location.pathname !== '/search/query' ? 
              selectedNotes.every(note => note.isPinned === true) ? (
              <button onClick={(e) => handleUnpin(e)} className={`${headerStyles.option} ${headerStyles.removePin} ${headerStyles.noteSelectBtn}`} >
                <FontAwesomeIcon icon={faMapPin} />
              </button>
              ) : (
              <button onClick={(e) => handlePin(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`} >
                <FontAwesomeIcon icon={faMapPin} />
              </button>
              )
            : null}

            <button onClick={(e) => handleArchive(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faArchive} />
            </button>
            <button onClick={() => setModalState(!modalState)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
            {modalState ? (
              <OptionsModal notes={selectedNotes} setOptionsModal={setModalState} isFromHeader={true}/>
            ) : null}
          </div>
        ) : currentLabel._id === "Trash" ? (
          <div className={headerStyles.right}>
            <button onClick={(e) => handleArchive(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faArchive} />
            </button>
            <button onClick={(e) => handleDelete(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button onClick={(e) => handleRestore(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faTrashRestore} />
            </button>
          </div>
        ) : (
          <div className={headerStyles.right}>
            <button onClick={(e) => handleTrash(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button onClick={(e) => handleRestore(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
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