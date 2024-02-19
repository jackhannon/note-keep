import React from 'react'

const noteOptionsModal = () => {
  return (
    <ul className={optionModalStyles.modal} ref={optionsModalRef}>
      {labelModalState ? <LabelModal note={note} setLabelModal={setLabelModal} labels={note.labels} /> : null}
      <li onClick={(e)=>handleTrash(e)}>Delete</li>
      {(labels && labels.length > 0) &&
      <li onClick={(e) => handleToggleLabelsModalOn(e)}>Change labels</li>}
      <li onClick={(e) => handleCopy(e)}>Make a copy</li>
  </ul>
  )
}

export default noteOptionsModal