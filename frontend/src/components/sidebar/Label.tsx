import React from 'react'
import { LabelType } from '../../interfaces'
import sidebarStyles from './sidebarStyles.module.css'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag } from '@fortawesome/free-solid-svg-icons'
import { useNotes } from '../../context/NoteContext'
interface Props {
  label: LabelType
}

const Label: React.FC<Props> = ({label}) => {
  const { currentLabel, handleSetLabel } = useNotes()
  return (
    <Link to={`/${label._id}`} onClick={() => handleSetLabel({title: label.title, _id: label._id})}
      className={`${sidebarStyles.child} ${
        currentLabel._id === label._id ? sidebarStyles.activeLabel : ""
    }`}>
      <div className={sidebarStyles.catagory}>
        <div className={sidebarStyles.icon}><FontAwesomeIcon icon={faTag} /></div>
        <span>
          {label.title}
        </span>
      </div>
    </Link>
  )
}

export default Label