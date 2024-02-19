import React from 'react'
import CreateNote from './CreateNote.tsx'
import Note from './NoteComponents/Note.tsx';
import MainStyles from './MainStyles.module.css'
import Masonry from 'react-masonry-css'
import { useParams } from 'react-router-dom';
import useNotesQuery from '../services/useNotesQuery.tsx';
import { useGlobalContext } from '../../../context/GlobalContext.tsx';

const Notes: React.FC = () => {

  const { labelId } = useParams()
  const {query} = useGlobalContext()
  const {data, isPending, isError, error} = useNotesQuery();

  const breakpoints = {
    default: 6,
    1200: 5,
    992: 4,
    768: 3,
    576: 2,
    460: 1,
  };

  if (isPending) {
    return (
      <div className={MainStyles.container}>
        <h1 className='loading-msg'>Loading...</h1>
      </div>
    )
  }
    
  if (isError) {
    return (<h1 className="error-msg">{error?.message}</h1>)
  }

  if (data) {
    if (!data.plainNotes.length && !data.pinnedNotes.length || ((!data.plainNotes.length) && 
      ["Trash", "Archive"].includes(labelId || ""))) 
    {
      return (
        <div className={`${MainStyles.container}`}>
          <div className={MainStyles.noNotes}>No notes found!</div>
        </div> 
      )
    } 

    return (
      <div className={MainStyles.container}>
        {!query && !["Trash", "Archive"].includes(labelId || "") ? (<CreateNote />) : null}
        <Masonry   
        breakpointCols={breakpoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column">
          {data.pinnedNotes.map((note, index) => (

            // the key should remain the same between renders
          <Note key={note._id + index} note={note} />
          ))}
          {data.plainNotes.map((note, index) => (
          <Note key={note._id + index} note={note} />
          ))}
        </Masonry>
      </div>
    )
  }
 }


export default Notes