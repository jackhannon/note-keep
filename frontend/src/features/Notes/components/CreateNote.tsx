import React, {useState, useRef} from 'react'
import MainStyles from '../styles/MainStyles.module.css'
import useSingleNoteMutation from '../services/useSingleNoteMutation'
import useClickOutside from '../../../hooks/useClickOutside'
import { useGlobalContext } from '../../../context/GlobalContext'

const EditNote: React.FC = () => {
  const [title, setTitle] = useState<string>("")
  const [body, setBody] = useState<string>("")
  const [createNoteIsFocused, setCreateNoteIsFocused] = useState<boolean>(false)
  const {noteCreate} = useSingleNoteMutation()
  const {currentLabel} = useGlobalContext()

  const divRef = useRef<HTMLDivElement>(null);

  const handleBlur = async () => {
    if (title || body) {
      noteCreate.mutate({title: title, body: body, labels: [currentLabel._id]})
    }
    setTitle("")
    setBody("")
    setCreateNoteIsFocused(false)
  }

  useClickOutside(divRef, handleBlur, createNoteIsFocused)

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value)
    e.target.style.height = "auto"; // Reset the height to auto
    e.target.style.height = `${e.target.scrollHeight}px`; // Set the new height
  }




  return (
    <div ref={divRef} className={`${MainStyles.newNote} ${createNoteIsFocused ? MainStyles.newNoteActive : ""}`}>
      {createNoteIsFocused ? (
        <input 
          aria-label={"new-note-title"}
          className={MainStyles.titleInput}
          placeholder='Title'
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      ) : null}
        <textarea
          aria-label={"new-note-body"}
          placeholder='Take a note...'
          className={MainStyles.bodyInput}
          onFocus={() => setCreateNoteIsFocused(true)}
          value={body}
          onChange={(e)=>handleBodyChange(e)}
        />
    </div>
  )
}

export default EditNote