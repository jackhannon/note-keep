import React, { useState, useRef, useLayoutEffect, memo } from 'react';
import NoteStyles from '../../styles/NoteStyles.module.css';
import MainStyles from '../../styles/MainStyles.module.css'
import optionModalStyles from '../../../../styles/optionModalStyles.module.css'
import NoteModal from './NoteModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faCheck, faEllipsisVertical, faMapPin, faTrash, faTrashRestore, faUndo, faX } from '@fortawesome/free-solid-svg-icons';
import { useGlobalContext } from '../../../../context/GlobalContext';
import { NoteType } from '../../../../interfaces';
import { useParams } from 'react-router-dom';
import { NOTE_TOGGLE_CLICKED } from '../../../../reducers/selectedNotesReducer';
import useSingleNoteMutation from '../../services/useSingleNoteMutation';
import LabelModal from '../LabelModal';
import useLabelsQuery from '../../../Labels/services/useLabelsQuery';
import useClickOutside from '../../../../hooks/useClickOutside';

interface Props {
  note: NoteType;
  innerRef?: React.Ref<HTMLDivElement>
}

const Note: React.FC<Props> = memo(({ note, innerRef }) => {
  const [noteState, setNoteState] = useState<boolean>(false);
  const [noteHoverState, setNoteHoverState] = useState<boolean>(false);
  const [optionsModalState, setOptionsModal] = useState<boolean>(false);
  const {selectedNotesState, dispatchSelectedNotes, handleClickWhileMultiSelect} = useGlobalContext()
  const [labelModalState, setLabelModal] = useState<boolean>(false)

  const {notes: selectedNotes, modeOn: multiSelectMode} = selectedNotesState
  const selectedNoteIds = selectedNotes.map(note => note._id)
  const {toggleNotePin, noteTrash, noteArchive, noteRestore, noteDelete, noteCreate, noteLabelUpdate} = useSingleNoteMutation(note)
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const optionRef = useRef<HTMLDivElement>(null);

  const {data: labels} = useLabelsQuery()
  const {labelId} = useParams()



  const handleClickOutsideOptionModal = () => {
    setOptionsModal(false)
    setLabelModal(false)
    setNoteHoverState(false)
  }

  const optionsModalRef = useRef<HTMLDivElement>(null)
  const optionsModalButtonRef = useRef<HTMLButtonElement>(null)
  useClickOutside([optionsModalRef, optionsModalButtonRef], handleClickOutsideOptionModal)




  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [note.body]);


  const handleSelectNoteToggle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    dispatchSelectedNotes({type: NOTE_TOGGLE_CLICKED, payload: note})
  }

  const handleOptionClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setOptionsModal(optionsModalState => !optionsModalState);
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
    noteCreate.mutate({title: note.title, body: note.body, labels: note.labels, date: Date.now()});
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
    setLabelModal(prevState => !prevState);
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
    <div className={NoteStyles.container} ref={innerRef}>
      {noteState && <NoteModal handleDelete={handleDelete} note={note} setNoteState={setNoteState} noteState={noteState} />}

      <div
        className={NoteStyles.note}
        aria-label={`note-item-${note._id}`}
        onClick={() => !noteState ? handleFocus() : null}
        onMouseEnter={() => setNoteHoverState(true)}
        onMouseLeave={() => handleMouseLeave()}
      >
    
        <div className={`
          ${NoteStyles.check} 
          ${noteHoverState || selectedNoteIds.includes(note._id) ? NoteStyles.fadeIn : ""
        }`}>
          <button aria-label={`check-for-note-${note._id}`} className={NoteStyles.options} id={NoteStyles.check} onClick={(e) => handleSelectNoteToggle(e)}>
            <FontAwesomeIcon icon={shouldNoteShowCheckMark() ? faCheck : faX} />
          </button>
        </div>
      

        {!["Trash", "Archive"].includes(labelId || "") && (
          <div className={`${NoteStyles.pin} ${note.isPinned || noteHoverState ? NoteStyles.fadeIn : ""}`} >
            <button 
              aria-label={note.isPinned ? `pinned-for-note-${note._id}` : `unpinned-for-note-${note._id}`}
              className={`${NoteStyles.options}`} 
              id={note.isPinned ? NoteStyles.removePin : ""} 
              onClick={!multiSelectMode ? (e)=>handleNotePinToggle(e) : (e) => handleClickWhileMultiSelect(e)}
            >
              <FontAwesomeIcon icon={faMapPin} />
            </button>
          </div>       
        )}
      
        <input
          aria-label={`note-title-for-note-${note._id}`}
          className={MainStyles.titleInput}
          placeholder="Title"
          type="text"
          value={note.title || ''}
          readOnly
        />
        <textarea
          aria-label={`note-body-for-note-${note._id}`}
          placeholder="Take a note..."
          className={NoteStyles.bodyInput}
          ref={textareaRef}
          value={note.body || ''}
          readOnly
        />


        {(!multiSelectMode && optionsModalState) && (
          <div className={optionModalStyles.modal} ref={optionsModalRef}>
            {labelModalState ? <LabelModal handleLabelToggle={handleLabelToggle} labels={note.labels} /> : null}
            <button aria-label={`trash-button-for-${note._id}`} className={optionModalStyles.modalBtn} onClick={(e)=>handleTrash(e)}>Delete</button>
            {(labels && labels.length > 0) &&
              <button aria-label={`change-labels-button-for-${note._id}`} className={optionModalStyles.modalBtn} onClick={(e) => handleToggleLabelsModal(e)}>Change labels</button>
            }
            <button aria-label={`copy-button-for-${note._id}`} className={optionModalStyles.modalBtn} onClick={(e) => handleCopy(e)}>Make a copy</button>
          </div>)
        }
          
        {!multiSelectMode ? 
          !["Trash", "Archive"].includes(labelId || "") ? (
            <div className={`${NoteStyles.tools} ${noteHoverState ? NoteStyles.fadeIn : ""}`} ref={optionRef}>
              <button aria-label={`archive-button-for-${note._id}`} className={NoteStyles.options} onClick={(e)=>handleArchive(e)}>
                <FontAwesomeIcon icon={faArchive} />
              </button>
              <button ref={optionsModalButtonRef} aria-label={`options-button-for-${note._id}`} className={NoteStyles.options} onClick={(e)=>handleOptionClick(e)}>
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </button>
            </div>
          ) : (labelId === "Trash") ? (
            <div className={`${NoteStyles.tools} ${noteHoverState ? NoteStyles.fadeIn : ""}`} ref={optionRef}>
              <button aria-label={`trash-restore-button-for-${note._id}`} className={NoteStyles.options} onClick={(e)=>handleRestore(e)}>
                <FontAwesomeIcon icon={faTrashRestore} />
              </button>
              <button aria-label={`trash-button-for-${note._id}`} className={NoteStyles.options} onClick={(e)=>handleDelete(e)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button aria-label={`archive-button-for-${note._id}`} className={NoteStyles.options} onClick={(e)=>handleArchive(e)}>
                <FontAwesomeIcon icon={faArchive} />
              </button>
            </div>
          ) : (labelId === "Archive") ? (
          <div className={`${NoteStyles.tools} ${noteHoverState ? NoteStyles.fadeIn : ""}`} ref={optionRef}>
            <button aria-label={`undo-button-for-${note._id}`} className={NoteStyles.options} onClick={(e)=>handleRestore(e)}>
              <FontAwesomeIcon icon={faUndo} />
            </button>
            <button aria-label={`trash-button-for-${note._id}`} className={NoteStyles.options} onClick={(e)=>handleTrash(e)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ) : null
      : null}
          
      </div>
    </div>
  );
});

export default Note;