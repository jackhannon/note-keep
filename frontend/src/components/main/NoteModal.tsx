import React, {useRef, useEffect, useState,  useLayoutEffect} from 'react'
import MainStyles from './MainStyles.module.css'
import NoteStyles from './NoteStyles.module.css'
import { NoteType } from '../../interfaces';
import { updateNote } from '../../utils/notes';
import { useAsyncFn } from '../../hooks/useAsync';
import { useNotes } from '../../context/NoteContext';


interface Props {
  noteState: boolean;
  setNoteState: React.Dispatch<React.SetStateAction<boolean>>;
  note: NoteType
  handleDelete: () => Promise<void>
}


const NoteModal: React.FC<Props> = ({handleDelete, setNoteState, noteState, note}) => {

  const [title, setTitle] = useState<string>(`${note.title}`)
  const [body, setBody] = useState<string>(`${note.body}`)
  const { updateLocalNote } = useNotes()
  const updateNoteState = useAsyncFn(updateNote)

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value)
    e.target.style.height = "auto"; // Reset the height to auto
    e.target.style.height = `${e.target.scrollHeight}px`; // Set the new height
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (textareaRef.current) {
      // Calculate the scroll height of the textarea content
      const scrollHeight = textareaRef.current.scrollHeight;
      // Set the textarea height to the scroll height
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [note.body]); // Recalculate height whenever the note body changes



  const divRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setTimeout(()=> {
        if (divRef.current && !divRef.current.contains(event.target as Node)) {
          handleBlur();
        }
      }, 100)
    };
    if (noteState) {
        document.addEventListener("mousedown", handleClickOutside);
    } 
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [title, body]);

  
  const handleUpdateNote = async () => {
    return updateNoteState.execute({title, body, id: note._id})
    .then(note => {
      updateLocalNote(note);
    })
  }
    
  const handleBlur = () => {
    if (!title && !body) {
      handleDelete()
    }
    if (title !== note.title || body !== note.body) {
      handleUpdateNote()
    }
    setNoteState(false)
  }


  return (
    <div className={NoteStyles.modalContainer}>
      <div className={NoteStyles.modal} ref={divRef}>
        <input 
          className={MainStyles.titleInput}
          placeholder='Title'
          type="text" 
          value={title}
          ref={titleInputRef}
          onChange={(e) => handleTitleChange(e)}
          // onBlur={() => handleBlur()}
        />
        <textarea
          placeholder='Take a note...'
          className={NoteStyles.bodyInput}
          value={body}
          ref={textareaRef}
          // onBlur={() => handleBlur()}
          onChange={(e)=>handleBodyChange(e)}
        />
      </div>
    </div>
  )
}

export default NoteModal