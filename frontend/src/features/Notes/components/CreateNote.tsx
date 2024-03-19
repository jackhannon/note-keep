import React, {useState, useRef, useLayoutEffect} from 'react'
import MainStyles from '../styles/MainStyles.module.css'
import useSingleNoteMutation from '../services/useSingleNoteMutation'
import useClickOutside from '../../../hooks/useClickOutside'
import { useGlobalContext } from '../../../context/GlobalContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NoteStyles from '../styles/NoteStyles.module.css'
import useIsValidInput from '../../../hooks/useIsValidInput'
import { faInfoCircle, faMapPin } from '@fortawesome/free-solid-svg-icons'
import ButtonWithHoverLabel from '../../Components/ButtonWithHoverLabel'

const CreateNote: React.FC = () => {
  const [createNoteIsFocused, setCreateNoteIsFocused] = useState<boolean>(false)
  const {noteCreate} = useSingleNoteMutation()
  const {currentLabel} = useGlobalContext()

  const divRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const [isTitleValid, title, setTitle] = useIsValidInput(0, 100)
  const [isBodyValid, body, setBody] = useIsValidInput(0, 100000)
  const [shouldBePinned, setShouldBePinned] = useState(false)
  
  const handleBlur = async () => {
    if (title || body) {
      noteCreate.mutate({title: title, body: body, labels: [currentLabel._id], date: Date.now(), isPinned: shouldBePinned})
    }
    setShouldBePinned(false)
    setTitle("")
    setBody("")
    setCreateNoteIsFocused(false)
    if (bodyRef.current) {
      bodyRef.current.style.height = `55px`
    }  
  }

  useClickOutside(divRef, handleBlur, createNoteIsFocused)



  //make custom hook that handles this 
  useLayoutEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.style.height = 'auto';
      const scrollHeight = bodyRef.current.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollHeightInVh = (scrollHeight / viewportHeight) * 100;
      
      if (scrollHeightInVh >= 6) {
        bodyRef.current.style.maxHeight= "50vh"
      }
      if (scrollHeightInVh < 6) {
        bodyRef.current.style.maxHeight= "1em"
      }

      if (scrollHeightInVh >= 50) {
        bodyRef.current.style.overflowY = "auto"
      } else {
        bodyRef.current.style.overflowY = "hidden"
      }
      bodyRef.current.style.height = `${Math.min(
        scrollHeightInVh,
        50
      )}vh`;
    }
  }, [body]);

  useLayoutEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      const scrollHeight = titleRef.current.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollHeightInVh = (scrollHeight / viewportHeight) * 100;
      titleRef.current.style.height = `${Math.min(
        scrollHeightInVh,
        10
      )}vh`;
    }
  }, [title]);

  const handleNewNotePinToggle = () => {
    setShouldBePinned(shouldBePinned => !shouldBePinned)
  }
 
  return (
    <div className={MainStyles.newNoteContainer}>
      <div ref={divRef} className={`${MainStyles.newNote} ${createNoteIsFocused ? MainStyles.newNoteActive : ""}`}>
         
        {createNoteIsFocused ? (
          <>
            <ButtonWithHoverLabel
              ariaLabel={`pin new note`}
              styles={`${NoteStyles.pin} ${NoteStyles.fadeIn}`}
              id={shouldBePinned ? NoteStyles.removePin : NoteStyles.addPin} 
              onClick={handleNewNotePinToggle}
              label={"Pin new note"}
            > 
              <FontAwesomeIcon icon={faMapPin} />
            </ButtonWithHoverLabel>
         
            <textarea 
              ref={titleRef}
              aria-label={"new-note-title"}
              className={NoteStyles.titleInput}
              placeholder='Title'
              value={title}
              onChange={(e) =>setTitle(e.target.value)}
            />
            <p id="title-validation-info" className={`${!isTitleValid ? NoteStyles.instructions : 'offscreen'}`}>
              <FontAwesomeIcon icon={faInfoCircle} />
              title must be 0-100 characters<br />
            </p>
          </>
      
        ) : null}

          <textarea
            aria-label={"new-note-body"}
            placeholder='Take a note...'
            className={NoteStyles.bodyInput}
            onFocus={() => setCreateNoteIsFocused(true)}
            value={body}
            ref={bodyRef}
            onChange={(e)=>setBody(e.target.value)}
          />
          <p id="body-validation-info" className={`${!isBodyValid ? NoteStyles.instructions : 'offscreen'}`}>
            <FontAwesomeIcon icon={faInfoCircle} />
            body must be 0-100000 characters<br />
          </p>
          {createNoteIsFocused ? (
            <div className={NoteStyles.noteTools}>
              <button aria-label={`close new note`} className={NoteStyles.closeButton} id={NoteStyles.createNoteButton} onClick={handleBlur}>
              Close
              </button>
            </div>
          ): null}
      </div>
    </div>
  )
}

export default CreateNote