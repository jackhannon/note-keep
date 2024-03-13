import React, {useState, useRef, useLayoutEffect} from 'react'
import MainStyles from '../styles/MainStyles.module.css'
import useSingleNoteMutation from '../services/useSingleNoteMutation'
import useClickOutside from '../../../hooks/useClickOutside'
import { useGlobalContext } from '../../../context/GlobalContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NoteStyles from '../styles/NoteStyles.module.css'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const EditNote: React.FC = () => {
  const [title, setTitle] = useState<string>("")
  const [body, setBody] = useState<string>("")
  const [createNoteIsFocused, setCreateNoteIsFocused] = useState<boolean>(false)
  const {noteCreate} = useSingleNoteMutation()
  const {currentLabel} = useGlobalContext()

  const divRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleBlur = async () => {
    if (title || body) {
      noteCreate.mutate({title: title, body: body, labels: [currentLabel._id], date: Date.now()})
    }
    setTitle("")
    setBody("")
    setCreateNoteIsFocused(false)
    if (textareaRef.current) {
      textareaRef.current.style.height = `55px`
    }  
  }

  useClickOutside(divRef, handleBlur, createNoteIsFocused)

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value)
  }

  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;

      const viewportHeight = window.innerHeight;

      const scrollHeightInVh = (scrollHeight / viewportHeight) * 100;
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


  return (
    <div className={MainStyles.newNoteContainer}>
      <div ref={divRef} className={`${MainStyles.newNote} ${createNoteIsFocused ? MainStyles.newNoteActive : ""}`}>
        {createNoteIsFocused ? (
          <>
            <div className={NoteStyles.createNote}>
              <button aria-label={`create-note`} className={NoteStyles.options} id={NoteStyles.createNoteButton} onClick={() => handleBlur()}>
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </div>
        
            <input 
              aria-label={"new-note-title"}
              className={MainStyles.titleInput}
              placeholder='Title'
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </>
        ) : null}
          <textarea
            aria-label={"new-note-body"}
            placeholder='Take a note...'
            className={MainStyles.bodyInput}
            onFocus={() => setCreateNoteIsFocused(true)}
            value={body}
            ref={textareaRef}
            onChange={(e)=>handleBodyChange(e)}
          />
      </div>
    </div>
  )
}

export default EditNote