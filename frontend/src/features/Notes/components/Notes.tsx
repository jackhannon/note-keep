import React, { useEffect, useRef, useState } from 'react'
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
  const [numColumns, setNumColumns] = useState<number>();
  const notesContainerRef = useRef(null);

  useEffect(() => {
    function calculateColumns() {
      if (!notesContainerRef.current) return 1;
      const width = notesContainerRef.current.clientWidth;
      
      if (width >= 1200) return 5;
      if (width >= 992) return 4;
      if (width >= 768) return 3;
      if (width >= 576) return 2;
      return 1;
    }

    const resizeObserver = new ResizeObserver(() => {
      setNumColumns(calculateColumns());
    })      
    
    if (notesContainerRef.current) {
      resizeObserver.observe(notesContainerRef.current)
    }
    const notesContainer = notesContainerRef.current
    return () => {
    if (notesContainer) {
      resizeObserver.unobserve(notesContainer)
    }
    };
  }, []);




  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  if (isPending) {
    return (
      <div className={MainStyles.notesContentContainer}>
        <h1 className='loading-msg'>Loading...</h1>
      </div>
    )
  }
    
  if (isError || !data) {
    return (
      <div className={MainStyles.notesContentContainer}>
        <h1 className='error-msg'>{error?.message || "Could not retrieve data"}</h1>
      </div>
    )  
  }

  const { pages } = data;
  if (!pages[0].length && ["Trash", "Archive"].includes(currentLabel._id || "")) {
    return (
      <div className={`${MainStyles.notesContentContainer}`}>
        <div className={MainStyles.noNotes}>No notes found!</div>
      </div> 
    )
  } else if (!pages[0].length) {
    return (
      <div className={`${MainStyles.notesContentContainer}`}>
        <CreateNote />
        <div className={MainStyles.noNotes}>No notes found!</div>
      </div> 
    )
  }
  return (
    <div className={MainStyles.notesContentContainer} ref={notesContainerRef}>
      {!query && !["Trash", "Archive"].includes(currentLabel._id || "") ? (<CreateNote />) : null}
      
      <Masonry   
      breakpointCols={numColumns}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column">
        {pages.map(notes => {
          return notes.map((singleNote, index) => {
            if (notes.length === index + 1) {
              return <Note innerRef={ref} key={singleNote._id + index} note={singleNote} />
            }
            return <Note key={singleNote._id + index} note={singleNote} />
          })
          }
        )}
      </Masonry>
      {
        isFetchingNextPage
        ? <h1 className='scroll-message'>Loading more...</h1>
        : !hasNextPage
        ? <h1 className='scroll-message'>Looks like you've reached the end!</h1>
        : null
      }
    </div>
  )
}



export default Notes