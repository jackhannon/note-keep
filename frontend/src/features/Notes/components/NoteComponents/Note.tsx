import React, { useState, useRef, useLayoutEffect } from 'react';
import NoteStyles from '../../styles/NoteStyles.module.css';
import MainStyles from '../../styles/MainStyles.module.css'
import optionModalStyles from '../../../../styles/optionModalStyles.module.css'
import NoteModal from './NoteModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faCheck, faEllipsisVertical, faTrash, faTrashRestore, faUndo, faX } from '@fortawesome/free-solid-svg-icons';
import { useGlobalContext } from '../../../../context/GlobalContext';
import { NoteType } from '../../../../interfaces';
import { useParams } from 'react-router-dom';
import { NOTE_TOGGLE_CLICKED } from '../../../../reducers/selectedNotesReducer';
import useSingleNoteMutation from '../../services/useSingleNoteMutation';
import LabelModal from '../LabelModal';
import useLabelsQuery from '../../../Labels/services/useLabelsQuery';
import NotePinButton from './NotePinButton';
import useClickOutside from '../../../../hooks/useClickOutside';

interface Props {
  note: NoteType;
}

const Note: React.FC<Props> = ({ note }) => {
  const [noteState, setNoteState] = useState<boolean>(false);
  const [noteHoverState, setNoteHoverState] = useState<boolean>(false);
  const [optionsModalState, setOptionsModal] = useState<boolean>(false);
  const {selectedNotesState, dispatchSelectedNotes} = useGlobalContext()
  const [labelModalState, setLabelModal] = useState<boolean>(false)

  const {notes: selectedNotes, modeOn: multiSelectMode} = selectedNotesState
  const selectedNoteIds = selectedNotes.map(note => note._id)
  const {toggleNotePin, noteTrash, noteArchive, noteRestore, noteDelete, noteCreate, noteLabelUpdate} = useSingleNoteMutation(note)
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const optionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null)

  const {data: labels} = useLabelsQuery()
  const {labelId} = useParams()

//all you need to do is remove the stop propagation from the labels modal.
//  since the labels is already within the optionsmodal, you dont have to account for the 
// risk of opening the note 


  const handleClickOutsideOptionModal = (e: MouseEvent) => {
    e.stopPropagation()
    setOptionsModal(false)
    setLabelModal(false)
    setNoteHoverState(false)
  }

  const optionsModalRef = useRef<HTMLDivElement>(null)

  useClickOutside(optionsModalRef, handleClickOutsideOptionModal)




  useLayoutEffect(() => {
    if (textareaRef.current) {
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, []);


  const handleSelectNoteToggle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    dispatchSelectedNotes({type: NOTE_TOGGLE_CLICKED, payload: note})
  }

  const handleOptionClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    if (!optionsModalState) {
      setOptionsModal(true);
    } 
  }

  const handleNotePinToggle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    toggleNotePin.mutate();
  };

  const handleArchive = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    noteArchive.mutate();
  };

  const handleTrash = (e: React.MouseEvent) => {
    e.stopPropagation();
    noteTrash.mutate();
  };

  const handleRestore = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    noteRestore.mutate();
  };

  const handleDelete = (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e?.stopPropagation();
    noteDelete.mutate();
  };

  const handleCopy = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
    noteCreate.mutate({title: note.title, body: note.body, labels: note.labels});
  };
  
  const handleMouseLeave = () => {
    if (!optionsModalState) {
      setNoteHoverState(false);
    } 
  }

  const handleLabelToggle = (labels: string[]) => {
    noteLabelUpdate.mutate(labels);
  };

  const handleToggleLabelsModal = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    setLabelModal(!labelModalState);
  }
  
  const handleFocus = () => {
    setNoteState(true);
  };

  const shouldNoteShowCheckMark = () => {
    if (noteHoverState && selectedNoteIds.includes(note._id)) {
      return false
    } else {
      return true
    }
  }

  return (
    <div className={NoteStyles.container} ref={containerRef}>
      {noteState && <NoteModal handleDelete={handleDelete} note={note} setNoteState={setNoteState} noteState={noteState} />}

      <div
        className={NoteStyles.note}
        onClick={() => !noteState ? handleFocus() : null}
        onMouseEnter={() => setNoteHoverState(true)}
        onMouseLeave={() => handleMouseLeave()}
      >
        {(noteHoverState || selectedNoteIds.includes(note._id)) && (
          <div className={NoteStyles.check} >
            <button aria-label="check" role="button" className={NoteStyles.options} id={NoteStyles.check} onClick={(e) => handleSelectNoteToggle(e)}>
              <FontAwesomeIcon icon={shouldNoteShowCheckMark() ? faCheck : faX} />
            </button>
          </div>
        )}

        {((note.isPinned || noteHoverState) && !["Trash", "Archive"].includes(labelId || "")) && (
          <NotePinButton handleNotePinToggle={handleNotePinToggle} isPinned={note.isPinned}/>
        )}
      
        <input
          className={MainStyles.titleInput}
          placeholder="Title"
          type="text"
          value={note.title || ''}
          readOnly
        />
        <textarea
          placeholder="Take a note..."
          className={NoteStyles.bodyInput}
          ref={textareaRef}
          value={note.body || ''}
          readOnly
        />


        {(!multiSelectMode && optionsModalState) && (
          <div className={optionModalStyles.modal} ref={optionsModalRef}>
            {labelModalState ? <LabelModal handleLabelToggle={handleLabelToggle} labels={note.labels} /> : null}
            <button className={optionModalStyles.modalBtn} onClick={(e)=>handleTrash(e)}>Delete</button>
            {(labels && labels.length > 0) &&
              <button className={optionModalStyles.modalBtn} onClick={(e) => handleToggleLabelsModal(e)}>Change labels</button>
            }
            <button className={optionModalStyles.modalBtn} onClick={(e) => handleCopy(e)}>Make a copy</button>
          </div>)
        }
          
        {(!multiSelectMode && noteHoverState) ? 
          !["Trash", "Archive"].includes(labelId || "") ? (
            <div className={NoteStyles.tools} ref={optionRef}>
              <button role="button" aria-label="archiveButton" className={NoteStyles.options} onClick={(e)=>handleArchive(e)}>
                <FontAwesomeIcon icon={faArchive} />
              </button>
              <button role="button" aria-label="optionsButton" className={NoteStyles.options} onClick={(e)=>handleOptionClick(e)}>
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </button>
            </div>
          ) : (labelId === "Trash") ? (
            <div className={NoteStyles.tools} ref={optionRef}>
              <button role="button" aria-label="trashRestoreButton" className={NoteStyles.options} onClick={(e)=>handleRestore(e)}>
                <FontAwesomeIcon icon={faTrashRestore} />
              </button>
              <button role="button" aria-label="trashButton" className={NoteStyles.options} onClick={(e)=>handleDelete(e)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button role="button" aria-label="archiveButton" className={NoteStyles.options} onClick={(e)=>handleArchive(e)}>
                <FontAwesomeIcon icon={faArchive} />
              </button>
            </div>
          ) : (labelId === "Archive") ? (
          <div className={NoteStyles.tools} ref={optionRef}>
            <button role="button" aria-label="undoButton" className={NoteStyles.options} onClick={(e)=>handleRestore(e)}>
              <FontAwesomeIcon icon={faUndo} />
            </button>
            <button role="button" aria-label="trashButton" className={NoteStyles.options} onClick={(e)=>handleTrash(e)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ) : null
      : null}
          
      </div>
    </div>
  );
};

export default Note;