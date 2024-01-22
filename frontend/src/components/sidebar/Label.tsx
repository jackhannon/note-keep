import React from 'react'
import { LabelType } from '../../interfaces'
import sidebarStyles from './sidebarStyles.module.css'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag } from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom'
import { useLabels } from '../../context/LabelContext'
interface Props {
  label: LabelType
}

const Label: React.FC<Props> = ({label}) => {
  const { labelId } = useParams()
  const { setCurrentLabel } = useLabels()
  return (
    <Link to={`/${label._id}`} onClick={() => setCurrentLabel({title: label.title, _id: label._id})}
      className={`${sidebarStyles.child} ${
        labelId === label._id ? sidebarStyles.activeLabel : ""
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