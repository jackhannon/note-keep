import React, {useEffect, useRef, useState} from 'react'
import sidebarStyles from '../styles/sidebarStyles.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faArchive, faLightbulb} from '@fortawesome/free-solid-svg-icons'
import Modal from './Modal';
import { LabelType } from '../../../interfaces';
import Label from './Label'
import { Link } from 'react-router-dom';
import useLabelsQuery from '../services/useLabelsQuery';
import { useGlobalContext } from '../../../context/GlobalContext';
import StatusMessage from '../../Components/StatusMessage';

const Sidebar: React.FC = () => {
  const {isSidebarOpen, handleSetLabel, currentLabel} = useGlobalContext()
  const {_id: labelId} = currentLabel
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [modalState, setModalState] = useState<boolean>(false)
  const {data: labels, isError, error} = useLabelsQuery()

  const hoverTimeoutId = useRef<number | NodeJS.Timeout>(0);
  const hoverTimeout = () => {
    hoverTimeoutId.current = setTimeout(() => {
      setIsHovering(true);
    }, 600);
  };

  const handleHover = () => {
    hoverTimeout()
  }

  const handleUnhover = () => {
    clearTimeout(hoverTimeoutId.current as number);
    setIsHovering(false);
  }

  useEffect(() => {
    return () => {
      clearTimeout(hoverTimeoutId.current as number);
    };
  }, [modalState]);
 

  const sidebarRef = useRef<HTMLDivElement>(null)

  
  return (
    <>

    {isError && error ?
      <StatusMessage>
        {error?.response?.data 
        ? String(error.response.data) 
        : error.message}
      </StatusMessage>
      : null
    }
    <div 
      className={`${sidebarStyles.sidebar} ${(isSidebarOpen || isHovering) ? sidebarStyles.open : null}`} 
      onMouseEnter={() => handleHover()} 
      onMouseLeave={() => handleUnhover()}
      ref={sidebarRef}
    >
    {modalState ? <Modal setModalState={setModalState}/> : null}

      <Link to={`/Notes`} onClick={() => handleSetLabel({title: "Notes", _id: "Notes"})} 
        className={`${sidebarStyles.child} ${labelId === "Notes" ? sidebarStyles.activeLabel : ""}`}
      >
        <div className={sidebarStyles.catagory}>
          <FontAwesomeIcon icon={faLightbulb} />
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
    
      <button 
        aria-label={"edit-labels"} 
        className={sidebarStyles.child} 
        onClick={() => setModalState(prevState => !prevState)}
      >
        <div className={sidebarStyles.catagory}>

          <FontAwesomeIcon icon={faEdit} />
          <span className={sidebarStyles.catagory}>
            Edit Labels
          </span>
        </div>

      </button>
      <Link 
        to={`/Archive`} 
        onClick={() => handleSetLabel({title: "Archive", _id: "Archive"})} 
        className={`${sidebarStyles.child} ${labelId === "Archive" ? sidebarStyles.activeLabel : ""}`}
      >
        <div className={sidebarStyles.catagory}>
          <FontAwesomeIcon icon={faArchive} />
          <span>
            Archive
          </span>
        </div>
      </Link>
      <Link 
        aria-label='' 
        to={`/Trash`} 
        onClick={() => handleSetLabel({title: "Trash", _id: "Trash"})} 
        className={`${sidebarStyles.child} ${labelId === "Trash" ? sidebarStyles.activeLabel : ""}`}
      >
        <div className={sidebarStyles.catagory}>
          <FontAwesomeIcon icon={faTrash} />
          <span>
            Trash
          </span>
        </div>
      </Link>
    </div>
  </>
  )
}

export default Sidebar