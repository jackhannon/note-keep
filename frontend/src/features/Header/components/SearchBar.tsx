import React, { useRef } from 'react'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import headerStyles from '../styles/headerStyles.module.css'
import { useGlobalContext } from '../../../context/GlobalContext'


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
      <button className={headerStyles.X} onClick={handleClearQuery}>X</button>
    </>
  )
}

export default SearchBar