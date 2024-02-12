import React from 'react'

const MultiSelectHead = () => {
  return (
    <>
        <div className={headerStyles.left}>
          <button onClick={() => handleMultiSelectCancel()} className={headerStyles.noteSelectBtn}>
            <FontAwesomeIcon icon={faX} /> 
          </button>

          <div className={headerStyles.title}>{selectedNotes.length} selected</div>
        </div>
        {/* determine which buttons to show depending on if we are in a hardcoded label */}
        {!["Trash", "Archive"].includes(String(currentLabel._id)) ? (
          <div className={headerStyles.right}>
            <button 
              onClick={(e) => handleToggleAllPins(e)} 
              className={`${headerStyles.option} 
                          ${headerStyles.noteSelectBtn}
                          ${selectedNotes.every(note => note.isPinned) ? headerStyles.removePin : ""}`}
            >
              <FontAwesomeIcon icon={faMapPin} />
            </button>
            <button onClick={(e) => handleSelectedNotesArchive(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faArchive} />
            </button>
            <button onClick={() => setOptionsModal(!optionsModalState)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
            {optionsModalState && (
              <ClickToggleableOptionsModal setOptionsModal={setOptionsModal} optionsModalState={optionsModalState} positioningClass={"headerModal"}>
                <li onClick={(e) => handleSelectedNotesTrash(e)}>Delete</li>
                <li onClick={(e) => handleSelectedNotesCopy(e)}>Make a copy</li>
              </ClickToggleableOptionsModal>
            )}
          </div>
        ) : currentLabel._id === "Trash" ? (
          <div className={headerStyles.right}>
            <button onClick={(e) => handleSelectedNotesArchive(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faArchive} />
            </button>
            <button onClick={(e) => handleSelectedNotesDelete(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button onClick={(e) => handleSelectedNotesRestore(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faTrashRestore} />
            </button>
          </div>
        ) : (
          <div className={headerStyles.right}>
            <button onClick={(e) => handleSelectedNotesTrash(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button onClick={(e) => handleSelectedNotesRestore(e)} className={`${headerStyles.option} ${headerStyles.noteSelectBtn}`}>
              <FontAwesomeIcon icon={faUndo} />
            </button>
          </div>
        )}
        
      </>
  )
}

export default MultiSelectHead