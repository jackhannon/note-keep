import { useQuery } from "@tanstack/react-query"
import { LabelType } from "../../../interfaces";
import { getLabels } from "./labelServices";
import { AxiosError } from "axios";


export const useLabelsQuery = () => {

  const {data, isSuccess, isPending, isError, error} = useQuery<LabelType[], AxiosError>({
    queryKey: ["labels"],
    queryFn: () => getLabels()
  })

  return { data, isSuccess, isPending, isError, error };
}

export default useLabelsQuery