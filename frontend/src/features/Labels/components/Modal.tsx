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
import ButtonWithHoverLabel from '../../Components/ButtonWithHoverLabel';

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

          <ButtonWithHoverLabel
            ariaLabel={"toggle-create-new-label-focus"} 
            onClick={() => setNewLabelFocusState(prevState => !prevState)}
            label={newLabelFocusState ? "Dismiss" : "Edit note"}
          > 
              <FontAwesomeIcon icon={newLabelFocusState ? faX : faPlus}/>
          </ButtonWithHoverLabel>
       
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
          <ButtonWithHoverLabel
            ariaLabel={"confirm-new-label-creation"} 
            styles={`${newLabelFocusState ? sidebarStyles.showCheck : null} ${sidebarStyles.confirmLabelBtn}`}
            onClick={onLabelCreate}
            label={"Create label"}
          > 
            <FontAwesomeIcon icon={faCheck}/>
          </ButtonWithHoverLabel>
        </div>
        <p id="title-validation-info" className={`${!isTitleValid ? NoteStyles.instructions : 'offscreen'}`}>
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