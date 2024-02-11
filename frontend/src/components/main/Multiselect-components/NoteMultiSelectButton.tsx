import React from 'react'
import NoteStyles from '../NoteStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faCheck } from '@fortawesome/free-solid-svg-icons'
import { useNotes } from '../../../context/NoteContext'


const NoteMultiSelectButton = () => {

  const {dispatchSelectedNotes} = useNotes()

  const handleMultiSelectToggle = () => {
    dispatchSelectedNotes({type: TOGGLED_MODE_OFF})
  }

  return (
    <div className={NoteStyles.check} >
        <button className={NoteStyles.options} id={NoteStyles.check} onClick={(e) => shouldNoteShowCheckMark(e)}>
          <FontAwesomeIcon icon={shouldNoteShowCheckMark() ? faCheck : faX} />
        </button>
    </div>
  )
}

export default NoteMultiSelectButton