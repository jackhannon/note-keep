import React from 'react'
import sidebarStyles from '../sidebarStyles.module.css'
import { LabelType, NoteType } from '../../../interfaces';
import { useAsyncFn } from '../../../hooks/useAsync';
import { useLabels } from '../../../context/LabelContext';
import { useNavigate} from 'react-router-dom';
import { deleteNote } from '../../../utils/notes';
import { deleteLabel } from '../../../utils/labels';
import { useNotes } from '../../../context/NoteContext';

interface Props {
  title: string;
  id: string;
  setDeletionModal: React.Dispatch<React.SetStateAction<boolean>>;
}




const DeleteModal: React.FC<Props> = ({title, id, setDeletionModal}) => {
  const { notes } = useNotes()
  const { deleteLocalLabel } = useLabels()
  const deleteLabelState = useAsyncFn(deleteLabel)
  const deleteNoteState = useAsyncFn(deleteNote)
  const navigate = useNavigate()

  const deleteNotesWithNoLabels = async (labelId: string) => {
    notes.plainNotes.forEach(async (note: NoteType) => {
      if (note.labels.length === 1 && note.labels[0]._id === labelId) {
        return deleteNoteState.execute(note._id)
      }
    })

    notes.pinnedNotes.forEach(async (note: NoteType) => {
      if (note.labels.length === 1 && note.labels[0]._id === labelId) {
        return deleteNoteState.execute(note._id)
      }
    })
  }

  const onDeletion = async () => {
    //this ensures that no note that exist within other existing labels gets deleted
    return deleteLabelState.execute(id)
    .then((label: LabelType) => {
      deleteLocalLabel(label._id)
      deleteNotesWithNoLabels(label._id)
      setDeletionModal(false)
      navigate("/Notes")
    })
  }
 
  return (
    <div className={sidebarStyles.confirmModal}>

      <div className={sidebarStyles.message}>
        Are you sure you want to delete the "{title}" label and it's associated notes?
      </div>
      <div className={sidebarStyles.deleteModalBtns}> 
        <button className={sidebarStyles.confirm} onClick={() => onDeletion()}>Yes</button>
        <button className={sidebarStyles.deny} onClick={() => setDeletionModal(false)}>No</button>
      </div>
    </div>
  )
}

export default DeleteModal