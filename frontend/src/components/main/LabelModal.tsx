import React, {useRef, useState } from 'react'
import optionModalStyles from '../optionModalStyles.module.css'
import { LabelType } from '../../interfaces';
import useLabelsQuery from '../../services/queryHooks/useLabelsQuery';
import useClickOutside from '../../hooks/useClickOutside';

interface Props {
  setLabelModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleLabelToggle: (labels: LabelType[]) => void
  labels: LabelType[]
}

const LabelModal: React.FC<Props> = ({setLabelModal, handleLabelToggle, labels}) => {
  const {data: allLabels} = useLabelsQuery()
  const [checkedLabels, setCheckedLabels] = useState<LabelType[]>(labels)

  const labelModalRef = useRef<HTMLDivElement>(null)

  const handleSetLabelModalFalse = () => {
    setLabelModal(false);
  }

  useClickOutside(labelModalRef, handleSetLabelModalFalse)

  const handleLabelClick = (label: LabelType, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    setCheckedLabels(prevCheckedLabels => {
      if (prevCheckedLabels.some(checkedLabel => checkedLabel._id === label._id)) {
        return prevCheckedLabels.filter(checkedLabel => checkedLabel._id !== label._id);
      } else {
        return [...prevCheckedLabels, label];
      }
    });
    handleLabelToggle([...checkedLabels, label])
  }
  
  return (
    <div ref={labelModalRef} className={optionModalStyles.labelModal}>
      <span className={optionModalStyles.title}>Label Note</span>
      {allLabels && allLabels.map(label=> {
        return (
          <div key={label._id || label.title} className={optionModalStyles.label} onClick={(e) => handleLabelClick(label, e)}>
             <input
              type="checkbox"
              value={label.title}
              checked={checkedLabels.some(checkedLabel => checkedLabel._id === label._id)}
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