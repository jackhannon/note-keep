import React, {useState, useRef } from 'react'
import sidebarStyles from '../styles/sidebarStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faTrash, faCheck, faPencil } from '@fortawesome/free-solid-svg-icons'

import useClickOutside from '../../../hooks/useClickOutside'
import useLabelMutation from '../services/useLabelMutation'
import DeleteModal from './DeleteModal'
import { LabelType } from '../../../interfaces'
import { useGlobalContext } from '../../../context/GlobalContext'

interface Props {
  label: LabelType;
}



const ModalLabel: React.FC<Props> = ({label}) => {
  const {currentLabel, handleSetLabel} = useGlobalContext()
  const [title, setTitle] = useState<string>(label.title)

  const [tagHoverState, setTagHoverState] = useState<boolean>(false)
  const [existingLabelFocusState, setExistingLabelFocusState] = useState<boolean>(false)
  const {updateLabelName, removeLabel} = useLabelMutation()

  const [deletionModal, setDeletionModal] = useState<boolean>(false)

  const handleToggleDeletionModal = () => {
    setDeletionModal(prevState => !prevState)
  }

  const handleDelete = async () => {
    await removeLabel.mutateAsync(label._id)
    handleToggleDeletionModal()
    if (currentLabel._id === label._id) {
      handleSetLabel({title: "Notes", _id: "Notes"})
    }
  }


  const labelRef = useRef<HTMLDivElement>(null);

  const handleBlurLabel = () => {
    setExistingLabelFocusState(false);
  }

  useClickOutside(labelRef, handleBlurLabel)
  

  const handleTrashClick = () => {
    if (!deletionModal) {
      handleToggleDeletionModal()
    }
  };

  const handlePatchLabel = async () => {
    if (!existingLabelFocusState) {
      setExistingLabelFocusState(true)
    } else {
      updateLabelName.mutate({_id: label._id, title: title})
      handleBlurLabel()
    }
  }
  
  return (
  
  <div className={sidebarStyles.field} ref={labelRef}>
    {deletionModal && 
      <DeleteModal 
        labelTitle={label.title} 
        handleDelete={handleDelete} 
        handleToggleDeletionModal={handleToggleDeletionModal}
      />
    }

    <button 
      aria-label={`trash-button-for-label-${label._id}`} 
      className={sidebarStyles.deleteLabel} 
      onClick={()=> handleTrashClick()} 
      onMouseOver={()=>setTagHoverState(true)} 
      onMouseLeave={()=>setTagHoverState(false)}
    >
      <FontAwesomeIcon icon={tagHoverState || existingLabelFocusState ? faTrash : faTag} />
    </button>
    <div 
      className={sidebarStyles.edit} 
      onMouseOver={()=> setTagHoverState(true)} 
      onMouseLeave={()=> setTagHoverState(false)} 
      onFocus={()=>setExistingLabelFocusState(true)}
    >
      <input 
        aria-label={`input-label-title-for-${label._id}`}
        value={title} 
        className={`${sidebarStyles.label} ${existingLabelFocusState ? sidebarStyles.input : null}`} 
        onChange={e=> setTitle(e.target.value)}
      />
    </div>
    <button 
      aria-label={existingLabelFocusState ? `confirm-edit-button-for-label-${label._id}` : `edit-button-for-label-${label._id}`} 
      className={sidebarStyles.renameLabel} 
      onClick={() => handlePatchLabel()}
    >
      <FontAwesomeIcon icon={existingLabelFocusState ? faCheck : faPencil}/>
    </button>
  </div>
  )
}

export default ModalLabel