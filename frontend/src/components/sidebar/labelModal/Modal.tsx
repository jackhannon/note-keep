import React, { useState, useRef } from 'react'
import sidebarStyles from '../sidebarStyles.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck, faX} from '@fortawesome/free-solid-svg-icons'
import ModalLabel from './ModalLabel';

import useClickOutside from '../../../hooks/useClickOutside';
import useLabelMutation from '../../../services/queryHooks/useLabelMutation';
import useLabelsQuery from '../../../services/queryHooks/useLabelsQuery';

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
          <button className={sidebarStyles.addNewLabelBtn} onClick={() => newLabelState ? setNewLabelState(false) : setNewLabelState(true)}><FontAwesomeIcon icon={newLabelState ? faX : faPlus}/></button>
          <input 
            className={`${sidebarStyles.newLabelField} ${newLabelState ? sidebarStyles.input : null}`} 
            placeholder={"Enter a new label"}
            onChange={(e)=>setNewLabel(e.target.value)} 
            value={newLabel}
            onFocus={()=>setNewLabelState(true)} 
            onBlur={()=>setTimeout(() => {
              setNewLabel("") 
            }, 100)}
            />
          <button className={`${newLabelState ? sidebarStyles.showCheck : null} ${sidebarStyles.confirmLabelBtn}`} 
            onClick={onLabelCreate}>
            <FontAwesomeIcon icon={faCheck}/>
          </button>
        </div>
        {labels && labels.map((label)=> {
          return <ModalLabel key={label._id + Date.now()} label={label} newLabelState={newLabelState} setNewLabelState={setNewLabelState}/>
        }
        )}
      </div>
    </div>
  )
}

export default Modal