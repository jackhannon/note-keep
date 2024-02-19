import React from 'react'
import headerStyles from "./headerStyles.module.css";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SearchBar from './SearchBar';
import { useNotes } from '../../context/NoteContext';



const DefaultHeader: React.FC = () => {

  const {setIsSidebarOpen, isSidebarOpen} = useNotes()

  const handleToggleSidebar = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <>
      <div className={headerStyles.left}>
        <button onClick={(e) => handleToggleSidebar(e)} className={headerStyles.icon}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className={headerStyles.title}>Keeper++</div>
      </div>

      <div className={headerStyles.center}>
        <SearchBar/>
      </div>

      <div className={headerStyles.right}>
    
      </div>
    </>
  )
}

export default DefaultHeader