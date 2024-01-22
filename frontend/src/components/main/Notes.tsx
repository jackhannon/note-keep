import React, { useEffect } from 'react'
import Create from './Create'
import Note from './Note';
import MainStyles from './MainStyles.module.css'
import Masonry from 'react-masonry-css'
import { useNotes } from '../../context/NoteContext';
import { useParams } from 'react-router-dom';
import { useAsyncFn } from '../../hooks/useAsync';
import { getNotes, getQuery } from '../../utils/notes';
const Notes: React.FC = () => {

  const { notes, setNotes, query, setQuery } = useNotes()
  const { labelId } = useParams()

  const notesFromIdState = useAsyncFn(getNotes)
  const queryNotesState = useAsyncFn(getQuery)


  useEffect(() => {
    if (query) {
      setQuery("")
    }
  }, [labelId])


  useEffect(() => {
    if (!query) {
      notesFromIdState.execute(labelId)
      .then(notes => {
        setNotes(()=> {
          return {
            plainNotes: [...notes.plainNotes],
            pinnedNotes: [...notes.pinnedNotes],
          }
        })
      })
    } else {
      queryNotesState.execute(query, labelId)
      .then(notes => {
        setNotes(() => {
          return {
            pinnedNotes: [],
            plainNotes: [...notes],
          }
        })
      })
    }
  }, [query, labelId])



  
  const breakpoints = {
    default: 6,
    1200: 5,
    992: 4,
    768: 3,
    576: 2,
    460: 1,
  };

  return notesFromIdState.loading ? (
    <div className={MainStyles.container}>
      <h1 className='loading-msg'>Loading...</h1>
    </div>
  ) : notesFromIdState.error ? (
    <h1 className="error-msg">{notesFromIdState.error.message}</h1>
  ) : (
    (!notes.plainNotes && !notes.pinnedNotes) || ((notes.plainNotes.length === 0) && 
    (["Trash", "Archive"].includes(labelId || ""))) ? (
    <div className={`${MainStyles.container}`}>
      <div className={MainStyles.noNotes}>No notes found!</div>
    </div>
    ) : (
    <div className={MainStyles.container}>
      {!["Trash", "Archive"].includes(labelId || "") ? (<Create />) : null}
      {/* className={NoteStyles.notesContainer} */}
      <Masonry   
      breakpointCols={breakpoints}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column">
        {notes.pinnedNotes.map((note) => (
         <Note key={note._id} note={note} />
        ))}
        {notes.plainNotes.map((note) => (
         <Note key={note._id} note={note} />
        ))}
      </Masonry>
    </div>
  ))}


export default Notes