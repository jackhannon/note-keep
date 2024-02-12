import React, {useRef, ReactNode} from 'react'
import optionModalStyles from './optionModalStyles.module.css'
import useClickOutside from '../hooks/useClickOutside';


interface Props { 
  setOptionsModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactNode
  positioningClass?: string
  optionsModalState: boolean
}

const ClickToggleableOptionsModal: React.FC<Props> = ({children, optionsModalState, setOptionsModal, positioningClass}) => {
  
  const modalRef = useRef<HTMLUListElement>(null)
  useClickOutside(modalRef, [optionsModalState], [setOptionsModal])

  return (
    <ul className={`${optionModalStyles.modal} ${positioningClass ? optionModalStyles[`${positioningClass}`] : ""}`} ref={modalRef}>
      {children}
    </ul>
  )
}

export default ClickToggleableOptionsModal