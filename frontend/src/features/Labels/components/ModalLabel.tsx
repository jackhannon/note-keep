import React, {useState, useRef } from 'react'
import sidebarStyles from '../styles/sidebarStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faTrash, faCheck, faPencil, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import NoteStyles from '../../Notes/styles/NoteStyles.module.css'

import useClickOutside from '../../../hooks/useClickOutside'
import useLabelMutation from '../services/useLabelMutation'
import DeleteModal from './DeleteModal'
import { LabelType } from '../../../interfaces'
import { useGlobalContext } from '../../../context/GlobalContext'
import useIsValidInput from '../../../hooks/useIsValidInput'
import ButtonWithHoverLabel from '../../Components/ButtonWithHoverLabel'

interface Props {
  label: LabelType;
}



const ModalLabel: React.FC<Props> = ({label}) => {
  const {currentLabel, handleSetLabel} = useGlobalContext()

  const [tagHoverState, setTagHoverState] = useState<boolean>(false)
  const [existingLabelFocusState, setExistingLabelFocusState] = useState<boolean>(false)
  const {updateLabelName, removeLabel} = useLabelMutation()

  const [deletionModal, setDeletionModal] = useState<boolean>(false)
  const [isTitleValid, title, setTitle] = useIsValidInput(0, 50, label.title)

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
    <>
      <div className={sidebarStyles.field} ref={labelRef}>
        {deletionModal && 
          <DeleteModal 
            labelTitle={label.title} 
            handleDelete={handleDelete} 
            handleToggleDeletionModal={handleToggleDeletionModal}
          />
        }

        <ButtonWithHoverLabel
          ariaLabel={`trash-button-for-label-${label._id}`} 
          onClick={handleTrashClick}
          onMouseOver= {()=>setTagHoverState(true)}
          onMouseLeave={()=>setTagHoverState(false)}
          label={"Trash label"}
        > 
          <FontAwesomeIcon icon={tagHoverState || existingLabelFocusState ? faTrash : faTag} />
        </ButtonWithHoverLabel>
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

        <ButtonWithHoverLabel
          ariaLabel={existingLabelFocusState ? `confirm-edit-button-for-label-${label._id}` : `edit-button-for-label-${label._id}`} 
          onClick={handlePatchLabel}
          label={"Edit label"}
        > 
          <FontAwesomeIcon icon={existingLabelFocusState ? faCheck : faPencil}/>
        </ButtonWithHoverLabel>

      </div>
      <p id="title-validation-info" className={`${!isTitleValid ? NoteStyles.instructions : 'offscreen'}`}>
        <FontAwesomeIcon icon={faInfoCircle} />
        label title must be 0-50 characters<br />
      </p>
    </>
  )
}

export default ModalLabel