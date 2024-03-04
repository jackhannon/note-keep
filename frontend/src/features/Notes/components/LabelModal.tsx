import React, {useRef, useState } from 'react'
import optionModalStyles from '../../../styles/optionModalStyles.module.css'
import useLabelsQuery from '../../Labels/services/useLabelsQuery';
import { LabelType } from '../../../interfaces';

interface Props {
  handleLabelToggle: (labels: string[]) => void
  labels: string[]
}

const LabelModal: React.FC<Props> = ({handleLabelToggle, labels}) => {
  const {data: allLabels} = useLabelsQuery()
  //find out why usequery refetches labels

  const [checkedLabelIds, setCheckedLabels] = useState<string[]>(labels)

  const labelModalRef = useRef<HTMLDivElement>(null)

  const handleLabelClick = (label: LabelType, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    let newLabels: string[];
    if (checkedLabelIds.some(checkedLabelId => checkedLabelId === label._id)) {
      const filteredLabels = checkedLabelIds.filter(checkedLabelId => checkedLabelId !== label._id);
      newLabels = filteredLabels
    } else {
      newLabels = [...checkedLabelIds, label._id];
    }
    setCheckedLabels(newLabels);
    handleLabelToggle(newLabels)
  }
  
  return (
    <div ref={labelModalRef} className={optionModalStyles.labelModal}>
      <span className={optionModalStyles.title}>Label Note</span>
      {allLabels && allLabels.map(label=> {
        return (
          <div key={label._id || label.title} aria-label={`label-toggle-for-label-${label._id}`} className={optionModalStyles.label} onClick={(e) => handleLabelClick(label, e)}>
             <input
              className={optionModalStyles.inputLabel}
              type="checkbox"
              value={label.title}
              checked={checkedLabelIds.some(checkedLabelId => checkedLabelId === label._id)}
              readOnly
            />
            <span>{label.title}</span>
          </div>
        )
      })}
    </div>
  )
}

export default LabelModal