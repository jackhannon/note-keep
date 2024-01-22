import React, {useRef, useEffect, useState} from 'react'
import optionModalStyles from '../../header/optionModalStyles.module.css'
import LabelModal from './LabelModal';
import { useLabels } from '../../../context/LabelContext';
import { NoteType } from '../../../interfaces';
import { useAsyncFn } from '../../../hooks/useAsync';
import { createNote, updateNote } from '../../../utils/notes';
import { useNotes } from '../../../context/NoteContext';
//there are cases where passing in the handle trash function from the header would not suffice
//because the same component is being called by indivual notes

interface Props {
  notes: NoteType[];
  setOptionsModal: React.Dispatch<React.SetStateAction<boolean>>;
  optionRef?: React.RefObject<HTMLDivElement>;
  isFromHeader?: boolean;
}

const OptionsModal: React.FC<Props> = ({notes, setOptionsModal, isFromHeader}) => {
  
  const modalRef = useRef<HTMLDivElement>(null)
  const [labelModalState, setLabelModal] = useState<boolean>(false)
  const {labels} = useLabels()
  const {createLocalNote, deleteLocalNote} = useNotes()
  const createNoteState = useAsyncFn(createNote)
  const updateNoteState = useAsyncFn(updateNote)


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setTimeout(()=> {
        if ((modalRef.current && !modalRef.current.contains(event.target as Node))) {
          setOptionsModal(false);
        }
      }, 100)
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };  
  }, []);

  const handleCopy = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
    if (!Array.isArray(notes)) {
      notes = [notes]
    }
    notes.forEach((note) => {
      createNoteState.execute(note.labels, note?.title, note?.body)
      .then(note => {
        createLocalNote(note)
      })
    })
  }

  const handleTrash = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation()
    if (!Array.isArray(notes)) {
      notes = [notes]
    }
    notes.forEach((note) => {
      updateNoteState.execute({title: note.title, body: note.body, id: note._id,
      options: {isArchived: false,
        isTrashed: true}
      }).then(note => {
        deleteLocalNote(note)
      })
    })
  }

  const handleChangeLabels = async (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.stopPropagation()
    if (!labelModalState) {
      setLabelModal(true)
    }
  }

  return (
    <div ref={modalRef} className={!isFromHeader ? optionModalStyles.modal : `${optionModalStyles.modal} ${optionModalStyles.headerModal}`}>

      {labelModalState ? <LabelModal setLabelModal={setLabelModal} note={notes[0]} /> : null}
      <ul>
        <li onClick={(e)=>handleTrash(e)} id={optionModalStyles.top}>Delete</li>
        {!isFromHeader && labels.length > 0 ?
        <li onClick={(e) => handleChangeLabels(e)}>Change labels</li>
        : null}
        <li id={optionModalStyles.bottom} onClick={(e) => handleCopy(e)}>Make a copy</li>
      </ul>
    </div>
  )
}

export default OptionsModal