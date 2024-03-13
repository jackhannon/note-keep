import React from 'react'
import headerStyles from "../styles/headerStyles.module.css";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SearchBar from './SearchBar';
import { useGlobalContext } from '../../../context/GlobalContext';



const DefaultHeader: React.FC = () => {

  const {setIsSidebarOpen} = useGlobalContext()

  const handleToggleSidebar = () => {
    setIsSidebarOpen(isSidebarOpen => !isSidebarOpen)
  }

  return (
    <>
      <div className={headerStyles.left}>
        <button onClick={() => handleToggleSidebar()} className={headerStyles.icon}>
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