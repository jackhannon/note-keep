import React, {useState, useRef, useEffect} from 'react'
import sidebarStyles from '../sidebarStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag, faTrash, faCheck, faPencil } from '@fortawesome/free-solid-svg-icons'
import { useLabels } from '../../../context/LabelContext'
import { updateLabel } from '../../../utils/labels'
import { useAsyncFn } from '../../../hooks/useAsync'
import { LabelType } from '../../../interfaces'
interface Props {
  label: LabelType;
  newLabelState: boolean;
  setNewLabelState: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeletionModal: (title: string, id: string) => void;
  deletionModal: boolean
}



const ModalLabels: React.FC<Props> = ({label, newLabelState, setNewLabelState, handleDeletionModal, deletionModal}) => {
  const {labels, updateLocalLabel} = useLabels()
  const [title, setTitle] = useState<string>(label.title)

  const [tagHoverState, setTagHoverState] = useState<boolean>(false)
  const [existingLabelFocusState, setExistingLabelFocusState] = useState<boolean>(false)

  const updateLabelState = useAsyncFn(updateLabel)


  const divRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        handleBlur()
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    console.log(labels)
  }, [labels]);
    

  const handleFocusAndHover = (setter: React.Dispatch<React.SetStateAction<boolean>>, desiredState: boolean) => {
    setter(desiredState)
  }
  
  const handleTrashClick = () => {
    newLabelState ? setNewLabelState(false) : null;
    if (existingLabelFocusState) {
      handleBlur()
    } else if (!deletionModal) {
      handleDeletionModal(title, label._id)
    }
  };

  const handlePatchLabel = async () => {
    newLabelState ? setNewLabelState(false) : null
    if (!existingLabelFocusState) {
      setExistingLabelFocusState(true)
    } else if (!deletionModal) {
      updateLabelState.execute(label._id, title)
      .then(label=> {
        console.log(label)
        updateLocalLabel(label._id, label.title)
      })
      handleBlur()
    }
  }

  const handleBlur = () => {
    setExistingLabelFocusState(false);
  }

  
  return (
  
  <div className={sidebarStyles.field} ref={divRef}>
    <button className={sidebarStyles.deleteLabel} onClick={()=> handleTrashClick()} onMouseOver={()=>(handleFocusAndHover(setTagHoverState, true))} onMouseLeave={()=>(handleFocusAndHover(setTagHoverState, false))}>
      <FontAwesomeIcon icon={tagHoverState || existingLabelFocusState ? faTrash : faTag} />
    </button>
    <div className={sidebarStyles.edit} 
    onMouseOver={()=>handleFocusAndHover(setTagHoverState, true)} 
    onMouseLeave={()=>handleFocusAndHover(setTagHoverState, false)} 
    onFocus={()=>handleFocusAndHover(setExistingLabelFocusState, true)}>
      <input 
        value={title} 
        className={`${sidebarStyles.label} ${existingLabelFocusState ? sidebarStyles.input : null}`} 
        onClick={() => newLabelState ? setNewLabelState(false) : null} 
        onChange={e=> setTitle(e.target.value)}
        />
    </div>
    <button className={sidebarStyles.renameLabel} onClick={() => handlePatchLabel()}><FontAwesomeIcon icon={existingLabelFocusState ? faCheck : faPencil}/></button>
  </div>
  )
}

export default ModalLabels