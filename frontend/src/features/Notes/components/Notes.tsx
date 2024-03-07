import React, { useEffect } from 'react'
import {useInView} from 'react-intersection-observer';
import CreateNote from './CreateNote.tsx';
import Note from './NoteComponents/Note.tsx';
import MainStyles from '../styles/MainStyles.module.css'
import Masonry from 'react-masonry-css'
import { useGlobalContext } from '../../../context/GlobalContext.tsx';
import useInfiniteNotesQuery from '../services/useInfiniteNotesQuery.tsx';
const Notes: React.FC = () => {
  const {query, currentLabel} = useGlobalContext()
  const {data, isPending, isError, error, isFetchingNextPage, fetchNextPage, hasNextPage} = useInfiniteNotesQuery();
 

  const {ref, inView} = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

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
    
  if (isError || !data) {
    return (
      <div className={MainStyles.container}>
        <h1 className='error-msg'>{error?.message || "Could not retrieve data"}</h1>
      </div>
    )  
  }

  const { pages } = data;
  if (!pages.length && ["Trash", "Archive"].includes(currentLabel._id || "")) {
    return (
      <div className={`${MainStyles.container}`}>
        <div className={MainStyles.noNotes}>No notes found!</div>
      </div> 
    )
  } else if (!pages.length) {
    return (
      <div className={`${MainStyles.container}`}>
        <CreateNote />
        <div className={MainStyles.noNotes}>No notes found!</div>
      </div> 
    )
  }

  return (
    <div className={MainStyles.container}>
      {!query && !["Trash", "Archive"].includes(currentLabel._id || "") ? (<CreateNote />) : null}
      <Masonry   
      breakpointCols={breakpoints}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column">
        {pages.map((notes) => 
          notes.map((singleNote, index) => {
            if (notes.length === index + 1) {
              return <Note innerRef={ref} key={singleNote._id + index} note={singleNote} />
            }
            return <Note key={singleNote._id + index} note={singleNote} />
          })
          
        )}
      </Masonry>
      {
        isFetchingNextPage
        //fix these to only span a small hight at the bottom of the page
        ? <h1 className='scroll-message'>Loading more...</h1>
        : !hasNextPage
        ? <h1 className='scroll-message'>Looks like you've reached the end!</h1>
        : null
      }
    </div>
  )
}



export default Notes