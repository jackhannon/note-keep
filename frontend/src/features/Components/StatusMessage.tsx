import React, { useRef } from 'react'
import { faExclamationTriangle, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NoteStyles from '../Notes/styles/NoteStyles.module.css'
type Props = {
  children: string
}

const StatusMessage: React.FC<Props> = ({children}) => {
  const errBoxRef = useRef<HTMLDivElement>(null)
  const handleClickX = () => {
    if (errBoxRef.current) {
      errBoxRef.current.classList.add("offscreen")
    }
  }

  return (
  <div ref={errBoxRef} className={`${"error-box"}`} >
    <div>
      <div className={`closeErrButton`}>
        <button aria-label={`dismiss error`} className={NoteStyles.options} onClick={() => handleClickX()}>
          <FontAwesomeIcon icon={faX} />
        </button>
      </div>
      <FontAwesomeIcon icon={faExclamationTriangle} style={{marginRight: "5px"}}/>
      {children}
    </div>
  </div>
  )
}

export default StatusMessage