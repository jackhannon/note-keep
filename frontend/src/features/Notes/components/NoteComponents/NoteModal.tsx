import React, {useRef, useLayoutEffect} from 'react'
import NoteStyles from '../../styles/NoteStyles.module.css'
import useSingleNoteMutation from '../../services/useSingleNoteMutation';
import { NoteType } from '../../../../interfaces';
import useClickOutside from '../../../../hooks/useClickOutside';
import useIsValidInput from '../../../../hooks/useIsValidInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faMapPin } from '@fortawesome/free-solid-svg-icons';


interface Props {
  noteState: boolean;
  setNoteState: React.Dispatch<React.SetStateAction<boolean>>;
  note: NoteType
  handleDelete: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}


const NoteModal: React.FC<Props> = ({handleDelete, setNoteState, note}) => {
  const {toggleNotePin} = useSingleNoteMutation(note)

  const { noteContentUpdate } = useSingleNoteMutation(note)

  const [isTitleValid, title, setTitle] = useIsValidInput(0, 100, note.title)
  const [isBodyValid, body, setBody] = useIsValidInput(0, 100000, note.body)

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value)
  }


  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);


  //make custom hook that handles this 
  useLayoutEffect(() => {
    if (bodyRef .current) {
      bodyRef.current.style.height = 'auto';
      const scrollHeight = bodyRef .current.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollHeightInVh = (scrollHeight / viewportHeight) * 100;
      if (scrollHeightInVh >= 10) {
        bodyRef.current.style.maxHeight= "65vh"
      }
      if (scrollHeightInVh < 10) {
        bodyRef.current.style.maxHeight= "1em"
      }
      if (scrollHeightInVh >= 65) {
        bodyRef .current.style.overflowY = "auto"
      } else {
        bodyRef.current.style.overflowY = "hidden"
      }
      bodyRef.current.style.height = `${Math.min(
        scrollHeightInVh,
        65
      )}vh`;
    }
  }, [body]);


  useLayoutEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      const scrollHeight = titleRef.current.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollHeightInVh = (scrollHeight / viewportHeight) * 100;
      if (scrollHeightInVh >= 6) {
        titleRef.current.style.overflowY = "auto"
      } else {
        titleRef.current.style.overflowY = "hidden"
      }
      titleRef.current.style.height = `${Math.min(
        scrollHeightInVh,
        10
      )}vh`;
    }
  }, [title]);


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

  const handleNotePinToggle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    toggleNotePin.mutate();
  };

  return (
    <div className={NoteStyles.modalContainer}>
      <div className={NoteStyles.modal} ref={noteRef}>
        <div className={`${NoteStyles.pin} ${NoteStyles.fadeIn}`} >
          <button 
            aria-label={note.isPinned ? `pinned-for-note-${note._id}` : `unpinned-for-note-${note._id}`}
            className={`${NoteStyles.options}`} 
            id={note.isPinned ? NoteStyles.removePin : NoteStyles.addPin} 
            onClick={(e) => handleNotePinToggle(e)}
          >
            <FontAwesomeIcon icon={faMapPin} />
          </button>
        </div>      
        <textarea
          aria-label={"active note title"}
          className={NoteStyles.titleInput}
          placeholder='Title'
          value={title}
          ref={titleRef}
          onChange={(e) => handleTitleChange(e)}
        />
        <p id="title-validation-info" className={`${!isTitleValid ? NoteStyles.instructions : NoteStyles.offscreen}`}>
          <FontAwesomeIcon icon={faInfoCircle} />
          title must be 0-100 characters<br />
        </p>
        <textarea
          aria-label={"active note body"}
          placeholder='Take a note...'
          className={NoteStyles.bodyInput}
          value={body}
          ref={bodyRef}
          onChange={(e)=>handleBodyChange(e)}
        />
        <p id="body-validation-info" className={`${!isBodyValid ? NoteStyles.instructions : NoteStyles.offscreen}`}>
          <FontAwesomeIcon icon={faInfoCircle} />
          body must be 0-100000 characters<br />
        </p>
        <div className={NoteStyles.noteTools}>
          <button aria-label={`close new note`} className={NoteStyles.closeButton} id={NoteStyles.createNoteButton} onClick={handleBlur}>
            Close
          </button>
      </div>
      </div>
    </div>
  )
}

export default NoteModal