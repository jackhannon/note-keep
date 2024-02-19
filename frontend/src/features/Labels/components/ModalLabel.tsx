import React, {useState, useRef } from 'react'
import sidebarStyles from '../sidebarStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faTrash, faCheck, faPencil } from '@fortawesome/free-solid-svg-icons'

import useClickOutside from '../../../hooks/useClickOutside'
import useLabelMutation from '../services/useLabelMutation'
import DeleteModal from './DeleteModal'
import { LabelType } from '../../../interfaces'
import { useGlobalContext } from '../../../context/GlobalContext'

interface Props {
  label: LabelType;
  newLabelState: boolean;
  setNewLabelState: React.Dispatch<React.SetStateAction<boolean>>;
}



const ModalLabel: React.FC<Props> = ({label, newLabelState, setNewLabelState}) => {
  const {currentLabel, handleSetLabel} = useGlobalContext()
  const [title, setTitle] = useState<string>(label.title)

  const [tagHoverState, setTagHoverState] = useState<boolean>(false)
  const [existingLabelFocusState, setExistingLabelFocusState] = useState<boolean>(false)
  const {updateLabelName, removeLabel} = useLabelMutation()

  const [deletionModal, setDeletionModal] = useState<boolean>(false)

  const handleToggleDeletionModal = () => {
    setDeletionModal(!deletionModal)
  }

  const handleDelete = async () => {
    await removeLabel.mutateAsync(label._id)
    handleToggleDeletionModal()
    if (currentLabel._id === label._id) {
      handleSetLabel({title: "Notes", _id: "Notes"})
    }
  }

  const handleBlur = () => {
    setExistingLabelFocusState(false);
  }

  const labelRef = useRef<HTMLDivElement>(null);

  useClickOutside(labelRef, handleBlur)


  
  const handleTrashClick = () => {
    newLabelState ? setNewLabelState(false) : null;
    if (existingLabelFocusState) {
      handleBlur()
    } else if (!deletionModal) {
      handleToggleDeletionModal()
    }
  };

  const handlePatchLabel = async () => {
    newLabelState ? setNewLabelState(false) : null
    if (!existingLabelFocusState) {
      setExistingLabelFocusState(true)
    } else {
      updateLabelName.mutate({_id: label._id, title: title})
      handleBlur()
    }
  }
  
  return (
  
  <div className={sidebarStyles.field}>
    {deletionModal && 
      <DeleteModal 
        labelTitle={label.title} 
        handleDelete={handleDelete} 
        handleToggleDeletionModal={handleToggleDeletionModal}
      />
    }

    <button className={sidebarStyles.deleteLabel} onClick={()=> handleTrashClick()} onMouseOver={()=>setTagHoverState(true)} onMouseLeave={()=>setTagHoverState(false)}>
      <FontAwesomeIcon icon={tagHoverState || existingLabelFocusState ? faTrash : faTag} />
    </button>
    <div className={sidebarStyles.edit} 
      onMouseOver={()=> setTagHoverState(true)} 
      onMouseLeave={()=> setTagHoverState(false)} 
      onFocus={()=>setExistingLabelFocusState(true)}
    >
      <input 
        value={title} 
        className={`${sidebarStyles.label} ${existingLabelFocusState ? sidebarStyles.input : null}`} 
        onClick={() => newLabelState ? setNewLabelState(false) : null} 
        onChange={e=> setTitle(e.target.value)}
      />
    </div>
    <button className={sidebarStyles.renameLabel} onClick={() => handlePatchLabel()}>
      <FontAwesomeIcon icon={existingLabelFocusState ? faCheck : faPencil}/>
    </button>
  </div>
  )
}

export default ModalLabel