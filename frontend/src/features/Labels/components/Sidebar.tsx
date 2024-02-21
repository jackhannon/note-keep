import React, {useState, useRef} from 'react'
import sidebarStyles from '../styles/sidebarStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faArchive, faLightbulb} from '@fortawesome/free-solid-svg-icons'
import Modal from './Modal';
import { LabelType } from '../../../interfaces';
import Label from './Label'
import { Link, useParams } from 'react-router-dom';
import useLabelsQuery from '../services/useLabelsQuery';
import { useGlobalContext } from '../../../context/GlobalContext';


const Sidebar: React.FC = () => {
  const { labelId } =  useParams()
  const {isSidebarOpen, handleSetLabel} = useGlobalContext()

  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [modalState, setModalState] = useState<boolean>(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const {data: labels} = useLabelsQuery()


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
    <div className={sidebarStyles.container}>
      {modalState ? <Modal setModalState={setModalState}/> : null}
      <div className={`${sidebarStyles.sidebar} ${(isSidebarOpen || isHovering) ? sidebarStyles.open : null}`} onMouseOver={()=>handleHover()} onMouseLeave={(e)=>handleUnhover(e)}>
        <Link to={`/Notes`} onClick={() => handleSetLabel({title: "Notes", _id: "Notes"})} 
          className={`${sidebarStyles.child} ${labelId === "Notes" ? sidebarStyles.activeLabel : ""}`}
        >
          <div className={sidebarStyles.catagory}>
            <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faLightbulb} /></div>
            <span>
              All Notes
            </span>
          </div>
        </Link>
        
        {labels &&
          labels.map((label: LabelType) => (
            <Label label={label} key={label._id}/>
          ))
        }
      
        <button className={sidebarStyles.child} onClick={() => setModalState(!modalState)}>
          <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faEdit} /></div>
          <span className={sidebarStyles.catagory}>
          Edit Labels
          </span>
        </button>
        <Link to={`/Archive`} onClick={() => handleSetLabel({title: "Archive", _id: "Archive"})} 
          className={`${sidebarStyles.child} ${labelId === "Archive" ? sidebarStyles.activeLabel : ""}`}
        >
          <div className={sidebarStyles.catagory}>
            <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faArchive} /></div>
            <span>
              Archive
            </span>
          </div>
        </Link>
        <Link to={`/Trash`} onClick={() => handleSetLabel({title: "Trash", _id: "Trash"})} 
          className={`${sidebarStyles.child} ${labelId === "Trash" ? sidebarStyles.activeLabel : ""}`}
        >
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