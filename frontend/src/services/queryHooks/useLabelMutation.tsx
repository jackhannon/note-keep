import { useMutation, useQueryClient, } from "@tanstack/react-query";
import { createLabel, updateLabel } from "../labelServices";
import { LabelType } from "../../interfaces";

export const useLabelMutation = (labelId: number) => {
  const {getQueryData, setQueryData} = useQueryClient();

  
  const updateLabelName = useMutation({
    mutationFn: (title: string) => {
      return updateLabel(labelId, title)
    },
    onMutate: (title: string) => {
      const previousLabels = getQueryData(['labels'])

      setQueryData(['labels'], (prevLabels: LabelType[]) => {
        return prevLabels.map(label => {
          if (label._id === labelId) {
            label.title = title
          }
          return label
        })
      })
      return { previousLabels }
    },

    onError: (err, newNotes, context) => {
      setQueryData(['labels'], context?.previousLabels)
    },
  })


  const addLabel = useMutation({
    mutationFn: (title: string) => {
      return createLabel(title)
    },
    onMutate: (title: string) => {
      const previousLabels = getQueryData(['labels', labelId])

      setQueryData(['labels'], (prevLabels: LabelType[]) => {
        return prevLabels.push({title: title})
      })
      return { previousLabels }
    },

    onError: (err, newNotes, context) => {
      setQueryData(['labels'], context?.previousLabels)
    },
  })


  const deleteLabel = useMutation({
    mutationFn: (labelId) => {
      return deleteLabel(labelId)
    },
    onMutate: (labelId) => {
      const previousLabels = getQueryData(['labels'])

      setQueryData(['labels'], (prevLabels: LabelType[]) => {
        return prevLabels.filter(label => label._id !== labelId)
      })
      return { previousLabels }
    },

    onError: (err, newNotes, context) => {
      setQueryData(['labels'], context?.previousLabels)
    },
  })

  return {updateLabelName, deleteLabel, addLabel}
}

export default useLabelMutation