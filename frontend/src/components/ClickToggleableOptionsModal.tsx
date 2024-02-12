import React, {useRef, useEffect, ReactNode} from 'react'
import optionModalStyles from './optionModalStyles.module.css'


interface Props { 
  setOptionsModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode
}

const ClickToggleableOptionsModal: React.FC<Props> = ({children, setOptionsModal}) => {
  
  const modalRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setTimeout(()=> {
        if ((modalRef.current && !modalRef.current.contains(event.target as Node))) {
          setOptionsModal(false);
        }
      }, 100)
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };  
  }, []);


  return (
    <ul className={optionModalStyles.modal} ref={modalRef}>
      {children}
    </ul>
  )
}

export default ClickToggleableOptionsModal