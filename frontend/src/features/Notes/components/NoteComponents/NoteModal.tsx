import React, {useRef, useState,  useLayoutEffect} from 'react'
import MainStyles from '../..//styles/MainStyles.module.css'
import NoteStyles from '../../styles/NoteStyles.module.css'
import useSingleNoteMutation from '../../services/useSingleNoteMutation';
import { NoteType } from '../../../../interfaces';
import useClickOutside from '../../../../hooks/useClickOutside';


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
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;

      const viewportHeight = window.innerHeight;

      const scrollHeightInVh = (scrollHeight / viewportHeight) * 100;
      console.log(scrollHeightInVh)
      if (scrollHeightInVh >= 65) {
        textareaRef.current.style.overflowY = "auto"
      } else {
        textareaRef.current.style.overflowY = "hidden"
      }
      textareaRef.current.style.height = `${Math.min(
        scrollHeightInVh,
        65
      )}vh`;
    }
  }, [body]);


  const handleBlur = (e: MouseEvent) => {
    e.stopPropagation()

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