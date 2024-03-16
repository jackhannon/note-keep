import React, { useState, useRef, useLayoutEffect, memo } from 'react';
import NoteStyles from '../../styles/NoteStyles.module.css';
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
import ButtonWithHoverLabel from '../../../Components/ButtonWithHoverLabel';

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
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
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


  //make custom hook that handles this 
  useLayoutEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      const scrollHeight = titleRef.current.scrollHeight;
      titleRef.current.style.height = `${Math.min(scrollHeight, 10)}vh`;
    }
  }, [note.title]);

  useLayoutEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.style.height = 'auto';
      const scrollHeight = bodyRef.current.scrollHeight;
      bodyRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [note.body]);


  const handleSelectNoteToggle = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
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
    noteCreate.mutate({title: note.title, body: note.body, labels: note.labels, date: Date.now(), isPinned: false});
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
  
  const handleFocus = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (!noteState && !multiSelectMode) {
      setNoteState(true);
    }
    if (multiSelectMode) {
     handleSelectNoteToggle(e)
    }
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
        onClick={(e) => handleFocus(e)}
        onMouseEnter={() => setNoteHoverState(true)}
        onMouseLeave={() => handleMouseLeave()}
      >
    
  
        <ButtonWithHoverLabel 
          ariaLabel={`check-for-note-${note._id}`}
          styles={`${NoteStyles.check} ${noteHoverState || selectedNoteIds.includes(note._id) ? NoteStyles.fadeIn : ""}`}
          id={NoteStyles.check}
          onClick={handleSelectNoteToggle}
          label={shouldNoteShowCheckMark() ? "Select note" : "Unselect note"}
        > 
          <FontAwesomeIcon icon={shouldNoteShowCheckMark() ? faCheck : faX} />
        </ButtonWithHoverLabel>

      

        {!["Trash", "Archive"].includes(labelId || "") && (
            <ButtonWithHoverLabel 
              ariaLabel={note.isPinned ? `pinned-for-note-${note._id}` : `unpinned-for-note-${note._id}`}
              styles={`${NoteStyles.pin} ${note.isPinned || noteHoverState ? NoteStyles.fadeIn : ""}`}
              id={note.isPinned ? NoteStyles.removePin : NoteStyles.addPin} 
              onClick={!multiSelectMode ? handleNotePinToggle : handleClickWhileMultiSelect}
              label={note.isPinned ? "Unpin note" : "Pin note"}
            > 
              <FontAwesomeIcon icon={faMapPin} />
            </ButtonWithHoverLabel>
        )}
      
        <textarea
          aria-label={`note-title-for-note-${note._id}`}
          className={NoteStyles.titleInput}
          placeholder="Title"
          ref={titleRef}
          value={note.title || ''}
          readOnly
        />
        <textarea
          aria-label={`note-body-for-note-${note._id}`}
          placeholder="Take a note..."
          className={NoteStyles.bodyInputInactive}
          ref={bodyRef}
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
            <div className={`${NoteStyles.hoverNoteTools} ${noteHoverState ? NoteStyles.fadeIn : ""}`} ref={optionRef}>

              <ButtonWithHoverLabel 
                ariaLabel={`archive-button-for-${note._id}`} 
                onClick={handleArchive}
                label={"Archive note"}
              > 
                <FontAwesomeIcon icon={faArchive} />
              </ButtonWithHoverLabel>

              <button ref={optionsModalButtonRef} aria-label={`options-button-for-${note._id}`} className={NoteStyles.options} onClick={(e)=>handleOptionClick(e)}>
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </button>
            </div>
          ) : (labelId === "Trash") ? (
            <div className={`${NoteStyles.hoverNoteTools} ${noteHoverState ? NoteStyles.fadeIn : ""}`} ref={optionRef}>
              <ButtonWithHoverLabel 
                ariaLabel={`trash-restore-button-for-${note._id}`}
                onClick={handleRestore}
                label={"Restore note"}
              > 
                <FontAwesomeIcon icon={faTrashRestore} />
              </ButtonWithHoverLabel>

              <ButtonWithHoverLabel 
                ariaLabel={`trash-button-for-${note._id}`}
                onClick={handleDelete}
                label={"Delete note"}
              > 
                <FontAwesomeIcon icon={faTrash} />
              </ButtonWithHoverLabel>
          
              <ButtonWithHoverLabel 
                ariaLabel={`archive-button-for-${note._id}`}
                onClick={handleArchive}
                label={"Archive note"}
              > 
                <FontAwesomeIcon icon={faArchive} />
              </ButtonWithHoverLabel>
            </div>
          ) : (labelId === "Archive") ? (
          <div className={`${NoteStyles.hoverNoteTools} ${noteHoverState ? NoteStyles.fadeIn : ""}`} ref={optionRef}>
            <ButtonWithHoverLabel 
              ariaLabel={`undo-button-for-${note._id}`}
              onClick={handleRestore}
              label={"Restore note"}
            > 
              <FontAwesomeIcon icon={faUndo} />
            </ButtonWithHoverLabel>

            <ButtonWithHoverLabel 
              ariaLabel={`trash-button-for-${note._id}`}
              onClick={handleTrash}
              label={"Delete note"}
            > 
              <FontAwesomeIcon icon={faTrash} />
            </ButtonWithHoverLabel>
          </div>
        ) : null
      : null}
          
      </div>
    </div>
  );
});

export default Note;