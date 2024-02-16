import React from 'react'
import sidebarStyles from '../sidebarStyles.module.css'

interface Props {
  labelTitle: string;
  handleDelete: () => void;
  handleToggleDeletionModal: () => void
}
const DeleteModal: React.FC<Props> = ({labelTitle, handleDelete, handleToggleDeletionModal}) => {

  return (
    <div className={sidebarStyles.confirmModal}>
      <div className={sidebarStyles.message}>
        Are you sure you want to delete the "{labelTitle}" label and it's associated notes?
      </div>
        <div className={sidebarStyles.deleteModalBtns}> 
          <button className={sidebarStyles.confirm} onClick={() => handleDelete()}>Yes</button>
        <button className={sidebarStyles.deny} onClick={() => handleToggleDeletionModal()}>No</button>
      </div>
    </div>
  )
}

export default DeleteModal