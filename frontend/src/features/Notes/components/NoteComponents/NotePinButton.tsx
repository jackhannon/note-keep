import React from 'react'
import NoteStyles from '../../styles/NoteStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapPin } from '@fortawesome/free-solid-svg-icons'
import { useGlobalContext } from '../../../../context/GlobalContext'

type NotePinButtonProps = {
  handleNotePinToggle: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isPinned: boolean;
}
const NotePinButton:React.FC<NotePinButtonProps> = ({handleNotePinToggle, isPinned}) => {
  const {selectedNotesState, handleClickWhileMultiSelect} = useGlobalContext()

  const {modeOn: multiSelectMode} = selectedNotesState
  return (
      <div className={NoteStyles.pin}>
        <button 
          aria-label="pin"
          role='button'
          className={NoteStyles.options} 
          id={isPinned ? NoteStyles.removePin : ""} 
          onClick={!multiSelectMode ? (e)=>handleNotePinToggle(e) : (e) => handleClickWhileMultiSelect(e)}>

            {/* implement handleclickinside hook for this */}
          <FontAwesomeIcon icon={faMapPin} />
        </button>
      </div>
    
  )
}

export default NotePinButton