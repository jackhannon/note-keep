import React from 'react'

const noteOptionsModal = () => {
  return (
    <div className={optionModalStyles.modal} ref={optionsModalRef}>
      {labelModalState ? <LabelModal note={note} setLabelModal={setLabelModal} labels={note.labels} /> : null}
      <button onClick={(e)=>handleTrash(e)}>Delete</button>
      {(labels && labels.length > 0) &&
      <button onClick={(e) => handleToggleLabelsModalOn(e)}>Change labels</button>}
      <button onClick={(e) => handleCopy(e)}>Make a copy</button>
  </div>
  )
}

export default noteOptionsModal