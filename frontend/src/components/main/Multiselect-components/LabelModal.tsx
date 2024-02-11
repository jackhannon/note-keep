import React, {useRef, useEffect, useState } from 'react'
import optionModalStyles from '../../header/optionModalStyles.module.css'
import { NoteType } from '../../../interfaces';
import { LabelType } from '../../../interfaces';
import useLabelsQuery from '../../../services/queryHooks/useLabelsQuery';
import useSingleNoteMutation from '../../../services/queryHooks/useSingleNoteMutation';

interface Props {
  setLabelModal: React.Dispatch<React.SetStateAction<boolean>>;
  note: NoteType
}

const LabelModal: React.FC<Props> = ({setLabelModal, note}) => {
  const {data: labels} = useLabelsQuery()
  const {noteLabelUpdate} = useSingleNoteMutation(note._id)
  const labelModalRef = useRef<HTMLDivElement>(null)
  const [checkedLabels, setCheckedLabels] = useState<LabelType[]>([...note.labels])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setTimeout(()=> {
        if ((labelModalRef.current && !labelModalRef.current.contains(event.target as Node))) {
          setLabelModal(false);
        }
      }, 100)
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };  
  }, [setLabelModal, note.labels]);



  const handleLabelToggle = (label: LabelType, e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    noteLabelUpdate.mutate(checkedLabels);
    setCheckedLabels(prevCheckedLabels => {
      if (prevCheckedLabels.some(checkedLabel => checkedLabel._id === label._id)) {
        return prevCheckedLabels.filter(checkedLabel => checkedLabel._id !== label._id);
      } else {
        return [...prevCheckedLabels, label];
      }
    });
  }
  
  return (
    <div ref={labelModalRef} className={optionModalStyles.labelModal}>
      <span className={optionModalStyles.title}>Label Note</span>
      {labels && labels.map(label=> {
        return (
          <div key={label._id || label.title} className={optionModalStyles.label} onClick={(e) => handleLabelToggle(label, e)}>
             <input
              type="checkbox"
              value={label.title}
              checked={checkedLabels.some(checkedLabels => checkedLabels._id === label._id)}
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