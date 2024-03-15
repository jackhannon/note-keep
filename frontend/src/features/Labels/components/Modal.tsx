import React, { useState, useRef } from 'react'
import sidebarStyles from '../styles/sidebarStyles.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck, faX, faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import ModalLabel from './ModalLabel';
import NoteStyles from '../../Notes/styles/NoteStyles.module.css'
import useLabelMutation from '../services/useLabelMutation';
import useLabelsQuery from '../services/useLabelsQuery';
import useClickOutside from '../../../hooks/useClickOutside';
import useIsValidInput from '../../../hooks/useIsValidInput';

interface Props {
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: React.FC<Props> = ({ setModalState }) => {
  const {addLabel} = useLabelMutation()
  const {data: labels} = useLabelsQuery()
  const [newLabelFocusState, setNewLabelFocusState] = useState<boolean>(false)
  const [isTitleValid, newLabel, setNewLabel] = useIsValidInput(0, 50)

  const onLabelCreate = () => {
    if (newLabel.length > 0) {
      addLabel.mutate(newLabel)
    }
  }

  const labelsModalRef = useRef<HTMLDivElement>(null);

  const handleCloseLabelModal = () => {
    setModalState(false)
  }

  useClickOutside(labelsModalRef, handleCloseLabelModal)

  
  const modalLabelRef = useRef<HTMLDivElement>(null);

  const handleBlurLabel = () => {
    setNewLabelFocusState(false)
  }

  useClickOutside(modalLabelRef, handleBlurLabel)

  return (
    <div className={sidebarStyles.modalContainer}>
      <div ref={labelsModalRef} className={sidebarStyles.modal}>
        <div className={sidebarStyles.message}>Edit labels</div>

        <div className={sidebarStyles.newLabel} ref={modalLabelRef}>
          <button 
            aria-label="toggle-create-new-label-focus" 
            className={sidebarStyles.addNewLabelBtn} 
            onClick={() => setNewLabelFocusState(prevState => !prevState)}
          >
            <FontAwesomeIcon icon={newLabelFocusState ? faX : faPlus}/>
          </button>
          <input 
            aria-label="create-new-label"
            className={`${sidebarStyles.newLabelField} ${newLabelFocusState ? sidebarStyles.input : null}`} 
            placeholder={"Enter a new label"}
            onChange={(e)=>setNewLabel(e.target.value)} 
            value={newLabel}
            onFocus={()=>setNewLabelFocusState(true)} 
            onBlur={()=>setTimeout(() => {
              setNewLabel("") 
            }, 100)}
            />
          <button aria-label="confirm-new-label-creation" className={`${newLabelFocusState ? sidebarStyles.showCheck : null} ${sidebarStyles.confirmLabelBtn}`} 
            onClick={onLabelCreate}>
            <FontAwesomeIcon icon={faCheck}/>
          </button>
        </div>
        <p id="title-validation-info" className={`${!isTitleValid ? NoteStyles.instructions : NoteStyles.offscreen}`}>
          <FontAwesomeIcon icon={faInfoCircle} />
          label title must be 0-50 characters<br />
        </p>
        {labels && labels.map((label, index)=> {
          return <ModalLabel key={label._id + index} label={label}/>
        }
        )}
      </div>
    </div>
  )
}

export default Modal