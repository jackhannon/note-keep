import { useMutation, useQueryClient, } from "@tanstack/react-query";
import { createLabel, updateLabel, deleteLabel } from "./labelServices";
import { LabelType } from "../../../interfaces";
import { useGlobalContext } from "../../../context/GlobalContext";

export const useLabelMutation = () => {
  const { query, currentLabel } = useGlobalContext()

  const queryClient = useQueryClient();
  
  const updateLabelName = useMutation({
    mutationFn: (labelDetails: LabelType) => {
      return updateLabel(labelDetails._id, labelDetails.title)
    },
    onMutate: (labelDetails) => {
      const previousLabels = queryClient.getQueryData(['labels'])

      queryClient.setQueryData(['labels'], (prevLabels: LabelType[]) => {
        return prevLabels.map(label => {
          if (label._id === labelDetails._id) {
            label = {...label, title: labelDetails.title}
          }
          return label
        })
      })
      return { previousLabels }
    },

    onError: (_err, _newNotes, context) => {
      queryClient.setQueryData(['labels'], context?.previousLabels)
    },
  })


  const addLabel = useMutation({
    mutationFn: (title: string) => {
      return createLabel(title)
    },
    onMutate: (title: string) => {
      const previousLabels = queryClient.getQueryData(['labels'])

      queryClient.setQueryData(['labels'], (prevLabels: LabelType[]) => {
        return [...prevLabels, {_id: "", title: title}]
      })
      return { previousLabels }
    },

    onError: (_err, _newNotes, context) => {
      queryClient.setQueryData(['labels'], context?.previousLabels)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] })
    },
  })


  const removeLabel = useMutation({
    mutationFn: (labelId: string) => {
      return deleteLabel(labelId)
    },
    onMutate: (labelId) => {
      const previousLabels = queryClient.getQueryData(['labels'])

      queryClient.setQueryData(['labels'], (prevLabels: LabelType[]) => {
        return prevLabels.filter(label => label._id !== labelId)
      })
      return { previousLabels }
    },

    onError: (_err, _newNotes, context) => {
      queryClient.setQueryData(['labels'], context?.previousLabels)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", currentLabel._id, query] })
    },
  })

  return {updateLabelName, removeLabel, addLabel}
}

export default useLabelMutation