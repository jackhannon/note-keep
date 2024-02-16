import React, {useRef, useState,  useLayoutEffect} from 'react'
import MainStyles from '../MainStyles.module.css'
import NoteStyles from './NoteStyles.module.css'
import { NoteType } from '../../../interfaces';
import useClickOutside from '../../../hooks/useClickOutside';
import useSingleNoteMutation from '../../../services/queryHooks/useSingleNoteMutation';


interface Props {
  noteState: boolean;
  setNoteState: React.Dispatch<React.SetStateAction<boolean>>;
  note: NoteType
  handleDelete: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}


const NoteModal: React.FC<Props> = ({handleDelete, setNoteState, note}) => {
  const { noteContentUpdate } = useSingleNoteMutation(note)
  const [title, setTitle] = useState<string>(`${note.title}`)
  const [body, setBody] = useState<string>(`${note.body}`)

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


  const handleBlur = () => {
    if (!title && !body) {
      handleDelete()
    }
    if (title !== note.title || body !== note.body) {
      handleUpdateNote()
    }
    setNoteState(false)
  }

  const noteRef = useRef<HTMLDivElement>(null);

  useClickOutside(noteRef, handleBlur)
  

  const handleUpdateNote = async () => {
    noteContentUpdate.mutate({title, body})
  }

  return (
    <div className={NoteStyles.modalContainer}>
      <div className={NoteStyles.modal} ref={noteRef}>
        <input 
          className={MainStyles.titleInput}
          placeholder='Title'
          type="text" 
          value={title}
          ref={titleInputRef}
          onChange={(e) => handleTitleChange(e)}
        />
        <textarea
          placeholder='Take a note...'
          className={NoteStyles.bodyInput}
          value={body}
          ref={textareaRef}
          onChange={(e)=>handleBodyChange(e)}
        />
      </div>
    </div>
  )
}

export default NoteModal