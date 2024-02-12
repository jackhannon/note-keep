import React from 'react'
import NoteStyles from './NoteStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapPin } from '@fortawesome/free-solid-svg-icons'

type NotePinButtonProps = {
  handleNotePinToggle: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isPinned: boolean;
}
const NotePinButton:React.FC<NotePinButtonProps> = ({handleNotePinToggle, isPinned}) => {
  return (
  
      <div className={NoteStyles.pin}>
        <button className={NoteStyles.options} id={isPinned ? NoteStyles.removePin : ""} onClick={(e)=>handleNotePinToggle(e)}>
          <FontAwesomeIcon icon={faMapPin} />
        </button>
      </div>
    
  )
}

export default NotePinButton