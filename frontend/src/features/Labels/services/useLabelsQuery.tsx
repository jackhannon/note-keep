import { useQuery } from "@tanstack/react-query"
import { LabelType } from "../../../interfaces";
import { getLabels } from "./labelServices";


export const useLabelsQuery = () => {

  const {data, isSuccess, isPending, isError, error} = useQuery<LabelType[], Error>({
    queryKey: ["labels"],
    queryFn: () => getLabels()
  })

  return { data, isSuccess, isPending, isError, error };
}

export default useLabelsQuery