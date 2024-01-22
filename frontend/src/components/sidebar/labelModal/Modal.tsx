import React, { useState, useRef, useEffect } from 'react'
import sidebarStyles from '../sidebarStyles.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck, faX} from '@fortawesome/free-solid-svg-icons'
import ModalLabels from './ModalLabels';
import DeleteModal from './DeleteModal';
import { useLabels } from '../../../context/LabelContext'
import { useAsyncFn } from '../../../hooks/useAsync';
import { createLabel } from '../../../utils/labels';
import { LabelType } from '../../../interfaces';

interface Props {
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: React.FC<Props> = ({ setModalState}) => {
  const { labels, createLocalLabel } = useLabels()
  const createLabelState = useAsyncFn(createLabel)

  const [newLabelState, setNewLabelState] = useState<boolean>(false)
  const [newLabel, setNewLabel] = useState<string>("")
  
  const [deletionModalInfo, setDeletionModalInfo] = useState({
    title: "",
    id: ""
  })

  const onLabelCreate = async () => {
    return createLabelState.execute(newLabel)
    .then((label: LabelType) => {
     createLocalLabel(label)
    })
   }

  const [deletionModal, setDeletionModal] = useState<boolean>(false)

  const handleDeletionModal = (title: string, id: string) => {
    setDeletionModalInfo({title: title, id: id})
    setDeletionModal(true)
  }

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setTimeout(()=> {
        if (divRef.current && !divRef.current.contains(event.target as Node)) {
          setModalState(false)
        }
      }, 100)
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setModalState]);


  return (
      <div className={sidebarStyles.modalContainer}>
        <div className={sidebarStyles.modal} ref={divRef}>
        {deletionModal ? (
          <DeleteModal title={deletionModalInfo.title} id={deletionModalInfo.id} setDeletionModal={setDeletionModal}/>
          ) : null
        }
        <div className={sidebarStyles.message}>Edit labels</div>

        <div className={sidebarStyles.newLabel}>
          <button className={sidebarStyles.addNewLabelBtn} onClick={() => newLabelState ? setNewLabelState(false) : setNewLabelState(true)}><FontAwesomeIcon icon={newLabelState ? faX : faPlus}/></button>
          <input 
            className={`${sidebarStyles.newLabelField} ${newLabelState ? sidebarStyles.input : null}`} 
            placeholder={"Enter a new label"}
            onChange={(e)=>setNewLabel(e.target.value)} 
            value = {newLabel}
            onFocus={()=>setNewLabelState(true)} 
            onBlur={()=>setTimeout(() => {
              setNewLabel("") 
            }, 100)}
            />
          <button className={`${newLabelState ? sidebarStyles.showCheck : null} ${sidebarStyles.confirmLabelBtn}`} 
            onClick={() => onLabelCreate()}>
            <FontAwesomeIcon icon={faCheck}/>
          </button>
          </div>
          {labels.map((label, index)=> {
          return <ModalLabels key={index} label={label} newLabelState = {newLabelState} setNewLabelState={setNewLabelState} handleDeletionModal={handleDeletionModal} deletionModal={deletionModal}/>
        }
        )}
        </div>
      </div>
  )
}

export default Modal