import React, {useState, useRef, useEffect} from 'react'
import MainStyles from './MainStyles.module.css'
import { useNotes } from '../../context/NoteContext'
import { createNote } from '../../services/noteServices'
import { useAsyncFn } from '../../hooks/useAsync'

const EditNote: React.FC = () => {
  const [title, setTitle] = useState<string>("")
  const [body, setBody] = useState<string>("")
  const [newNoteState, setNewNoteState] = useState<boolean>(false)
  const createNoteState = useAsyncFn(createNote)


  const onNotePost = () => {
    return createNoteState.execute(currentLabel, title, body)
    .then(note => {
      setTitle("")
      setBody("")
      createLocalNote(note)
    })
  }


  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        handleBlur();
      }
    };
    if (newNoteState) {
        document.addEventListener("mousedown", handleClickOutside);
    } 
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [newNoteState, title, body]);


  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value)
    e.target.style.height = "auto"; // Reset the height to auto
    e.target.style.height = `${e.target.scrollHeight}px`; // Set the new height
  }

  const handleBlur = async () => {
    if (title || body) {
      onNotePost()
    }
    setNewNoteState(false)
  }


  return (
    <div ref={divRef} className={`${MainStyles.newNote} ${newNoteState ? MainStyles.newNoteActive : ""}`}>
      {newNoteState ? (
        <input 
          className={MainStyles.titleInput}
          placeholder='Title'
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      ) : null}
        <textarea
          placeholder='Take a note...'
          className={MainStyles.bodyInput}
          onFocus={() => setNewNoteState(true)}
          value={body}
          onChange={(e)=>handleBodyChange(e)}
        />
    </div>
  )
}

export default EditNote