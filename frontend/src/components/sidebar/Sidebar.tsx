import React, {useState, useRef, useEffect} from 'react'
import sidebarStyles from './sidebarStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faArchive, faLightbulb} from '@fortawesome/free-solid-svg-icons'
import Modal from './labelModal/Modal';
import { LabelType } from '../../interfaces';
import { useLabels } from '../../context/LabelContext';
import Label from './Label'
import { Link, useParams } from 'react-router-dom';
import { useAsyncFn } from '../../hooks/useAsync';
import { getLabels } from '../../utils/labels';


const Sidebar: React.FC = () => {
  const { labelId } =  useParams()
  const { labels, isOpen, setCurrentLabel, setLabels } = useLabels()
  const getLabelsState = useAsyncFn(getLabels)

  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [modalState, setModalState] = useState<boolean>(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  
  
  useEffect(() => {
    getLabelsState.execute()
    .then(labels => {
      setLabels(labels)
    })
  }, [])


  const handleHover = () => {
    if (!hoverTimeoutRef.current) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovering(true);
      }, 400);
    }
  }

  const handleUnhover = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovering(false);
  }

  return (
    <div>
      {modalState ? <Modal setModalState={setModalState}/> : null}
      <div className={`${sidebarStyles.sidebar} ${(isOpen || isHovering) ? sidebarStyles.open : null}`} onMouseOver={()=>handleHover()} onMouseLeave={(e)=>handleUnhover(e)}>
        <Link to={`/Notes`} onClick={() => setCurrentLabel({title: "Notes", _id: "Notes"})} className={`${sidebarStyles.child} ${
            labelId === "Notes" ? sidebarStyles.activeLabel : ""
          }`}>
          <div className={sidebarStyles.catagory}>
            <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faLightbulb} /></div>
            <span>
              All Notes
            </span>
          </div>
        </Link>
        
        {getLabelsState.loading || getLabelsState.error ? null : 
        labels.map((label: LabelType) => (
          <Label label={label} key={label._id}/>
        ))}
      
        <button className={sidebarStyles.child} onClick={() => setModalState(!modalState)}>
          <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faEdit} /></div>
          <span className={sidebarStyles.catagory}>
          Edit Labels
          </span>
        </button>
        <Link to={`/Archive`} onClick={() => setCurrentLabel({title: "Archive", _id: "Archive"})} className={`${sidebarStyles.child} ${
            labelId === "Archive" ? sidebarStyles.activeLabel : ""
          }`}>
          <div className={sidebarStyles.catagory}>
            <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faArchive} /></div>
            <span>
              Archive
            </span>
          </div>
        </Link>
        <Link to={`/Trash`} onClick={() => setCurrentLabel({title: "Trash", _id: "Trash"})} className={`${sidebarStyles.child} ${
            labelId === "Trash" ? sidebarStyles.activeLabel : ""
          }`}>
          <div className={sidebarStyles.catagory}>
            <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faTrash} /></div>
            <span>
              Trash
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar