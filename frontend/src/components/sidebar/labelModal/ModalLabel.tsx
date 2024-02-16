import React, {useState, useRef } from 'react'
import sidebarStyles from '../sidebarStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faTrash, faCheck, faPencil } from '@fortawesome/free-solid-svg-icons'

import useClickOutside from '../../../hooks/useClickOutside'
import useLabelMutation from '../../../services/queryHooks/useLabelMutation'
import DeleteModal from './DeleteModal'
import { useNavigate} from 'react-router-dom';
import { useNotes } from '../../../context/NoteContext'
import { LabelType } from '../../../interfaces'

interface Props {
  label: LabelType;
  newLabelState: boolean;
  setNewLabelState: React.Dispatch<React.SetStateAction<boolean>>;
}



const ModalLabel: React.FC<Props> = ({label, newLabelState, setNewLabelState}) => {
  const navigate = useNavigate()
  const {currentLabel} = useNotes()
  const [title, setTitle] = useState<string>(label.title)

  const [tagHoverState, setTagHoverState] = useState<boolean>(false)
  const [existingLabelFocusState, setExistingLabelFocusState] = useState<boolean>(false)
  const {updateLabelName, removeLabel} = useLabelMutation()

  const [deletionModal, setDeletionModal] = useState<boolean>(false)

  const handleToggleDeletionModal = () => {
    setDeletionModal(!deletionModal)
  }

  const handleDelete = () => {
    removeLabel.mutate(label._id)
    handleToggleDeletionModal()
    if (currentLabel._id === label._id) {
      navigate("/Notes")
    }
  }

  const handleBlur = () => {
    setExistingLabelFocusState(false);
  }

  const divRef = useRef<HTMLDivElement>(null);

  useClickOutside(divRef, handleBlur)


  
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
  
  <div className={sidebarStyles.field} ref={divRef}>
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