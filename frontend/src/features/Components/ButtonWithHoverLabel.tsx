import React, { ReactNode, useState } from 'react'
import NoteStyles from '../Notes/styles/NoteStyles.module.css'

type Props = {
  children: ReactNode,
  ariaLabel: string, 
  styles?: string, 
  id?: string,
  onMouseOver?: () => void,
  onMouseLeave?: () => void,
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  label: string
}

const ButtonWithHoverLabel: React.FC<Props> = ({ariaLabel, styles, id, onClick, children, label, onMouseOver, onMouseLeave}) => {
  const [isHovering, setIsHovering] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}   
      className={styles}
    >
      <button
        aria-label={ariaLabel}
        className={`${NoteStyles.options}`}
        id={id}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        onClick={(e) => onClick(e)}
      >
        {children}
        {isHovering && 
        <div className={`${'buttonLabel'}`}>
          {label}
        </div>
        }
      </button>
    </div>
  )
}

export default ButtonWithHoverLabel