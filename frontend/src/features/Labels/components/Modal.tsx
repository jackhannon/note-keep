import React, { useState, useRef } from 'react'
import sidebarStyles from '../styles/sidebarStyles.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck, faX} from '@fortawesome/free-solid-svg-icons'
import ModalLabel from './ModalLabel';

import useLabelMutation from '../services/useLabelMutation';
import useLabelsQuery from '../services/useLabelsQuery';
import useClickOutside from '../../../hooks/useClickOutside';

interface Props {
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: React.FC<Props> = ({ setModalState }) => {
  const {addLabel} = useLabelMutation()
  const {data: labels} = useLabelsQuery()
  const [newLabelState, setNewLabelState] = useState<boolean>(false)
  const [newLabel, setNewLabel] = useState<string>("")

  const onLabelCreate = () => {
    if (newLabel.length > 0) {
      addLabel.mutate(newLabel)
    }
  }

  const labelsModalRef = useRef<HTMLDivElement>(null);

  const handleSetModalStateFalse = () => {
    setModalState(false)
  }

  useClickOutside(labelsModalRef, handleSetModalStateFalse)


  return (
    <div className={sidebarStyles.modalContainer}>
      <div ref={labelsModalRef} className={sidebarStyles.modal}>
        <div className={sidebarStyles.message}>Edit labels</div>

        <div className={sidebarStyles.newLabel}>
          <button aria-label="toggle-create-new-label-focus" className={sidebarStyles.addNewLabelBtn} onClick={() => setNewLabelState(prevState => !prevState)}><FontAwesomeIcon icon={newLabelState ? faX : faPlus}/></button>
          <input 
            aria-label="create-new-label"
            className={`${sidebarStyles.newLabelField} ${newLabelState ? sidebarStyles.input : null}`} 
            placeholder={"Enter a new label"}
            onChange={(e)=>setNewLabel(e.target.value)} 
            value={newLabel}
            onFocus={()=>setNewLabelState(true)} 
            onBlur={()=>setTimeout(() => {
              setNewLabel("") 
            }, 100)}
            />
          <button aria-label="confirm-new-label-creation" className={`${newLabelState ? sidebarStyles.showCheck : null} ${sidebarStyles.confirmLabelBtn}`} 
            onClick={onLabelCreate}>
            <FontAwesomeIcon icon={faCheck}/>
          </button>
        </div>
        {labels && labels.map((label, index)=> {
          return <ModalLabel key={label._id + index} label={label} newLabelState={newLabelState} setNewLabelState={setNewLabelState}/>
        }
        )}
      </div>
    </div>
  )
}

export default Modal