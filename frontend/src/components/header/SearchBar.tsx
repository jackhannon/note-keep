import React, { useRef } from 'react'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import headerStyles from './headerStyles.module.css'
import { useNotes } from '../../context/NoteContext'
import { useLabels } from '../../context/LabelContext'


const SearchBar:React.FC = () => {
  const { setQuery, query } = useNotes()
  const { currentLabel } = useLabels()

  

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFocusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  return (
    <>
      <button onClick={() => handleFocusInput()}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
        <input 
          ref={inputRef}
          placeholder={`Search ${currentLabel.title}`}
          type="text" 
          value={query}
          onChange={(e) =>  handleQuery(e)}
        />
      <button className={headerStyles.X} onClick={() => setQuery("")}>X</button>
    </>
  )
}

export default SearchBar