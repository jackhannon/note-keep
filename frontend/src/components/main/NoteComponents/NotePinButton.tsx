import React from 'react'
import NoteStyles from './NoteStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapPin } from '@fortawesome/free-solid-svg-icons'

type NotePinButtonProps = {
  handlePinClick: (e: Event) => void
}
const NotePinButton:React.FC<NotePinButtonProps> = ({handlePinClick}) => {
  return (
  
      <div className={NoteStyles.pin}>
        <button className={NoteStyles.options} id={NoteStyles.removePin} onClick={(e)=>handlePinClick(e)}>
          <FontAwesomeIcon icon={faMapPin} />
        </button>
      </div>
    
  )
}

export default NotePinButton