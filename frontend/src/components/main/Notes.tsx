import React from 'react'
import EditNote from './EditNote.tsx'
import Note from './NoteComponents/Note.tsx';
import MainStyles from './MainStyles.module.css'
import Masonry from 'react-masonry-css'
import { useParams } from 'react-router-dom';
import useNotesQuery from '../../services/queryHooks/useNotesQuery.tsx';

const Notes: React.FC = () => {

  const { labelId } = useParams()

  const {data, isPending, isError, error} = useNotesQuery();

  // useEffect(() => {
  //   if (query) {
  //     setQuery("")
  //   }
  // }, [labelId])


  // useEffect(() => {
  //   if (!query) {
  //     ""
  //   } else {
  //     ""
  //   }
  // }, [query, labelId])



  
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
    if (!data.plainNotes && !data.pinnedNotes || ((data.plainNotes.length === 0) && 
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
        {!["Trash", "Archive"].includes(labelId || "") ? (<EditNote />) : null}
        {/* className={NoteStyles.notesContainer} */}
        <Masonry   
        breakpointCols={breakpoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column">
          {data.pinnedNotes.map((note) => (
          <Note key={note._id} note={note} />
          ))}
          {data.plainNotes.map((note) => (
          <Note key={note._id} note={note} />
          ))}
        </Masonry>
      </div>
    )
  }
 }


export default Notes