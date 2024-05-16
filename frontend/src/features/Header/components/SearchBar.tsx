import React, { useRef } from 'react'
import { faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import headerStyles from '../styles/headerStyles.module.css'
import { useGlobalContext } from '../../../context/GlobalContext'
import NoteStyles from '../../Notes/styles/NoteStyles.module.css'

const SearchBar:React.FC = () => {
  const { query, setQuery, currentLabel } = useGlobalContext();

  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFocusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }


  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleClearQuery = () => {
    setQuery("")
  }

  return (
    <>
    
      <button onClick={() => handleFocusInput()}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
      <input 
        ref={inputRef}
        placeholder={`Search ${currentLabel.title}`}
        type="text" 
        value={query}
        onChange={(e) => handleQuery(e)}
      />
      <div className={`${headerStyles.clearInputButton} ${query ? NoteStyles.fadeIn: null}`}>
        <button 
          aria-label={`clear-search-input`} 
          onClick={handleClearQuery}
        >
          <FontAwesomeIcon icon={faX} />
        </button>
      </div>
    </>
  )
}

export default SearchBar