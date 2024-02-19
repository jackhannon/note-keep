import { useQuery } from "@tanstack/react-query"
import { getNotes } from "./noteServices";
import { useParams } from "react-router";
import { NotesData } from "../../../interfaces";
import { useGlobalContext } from "../../../context/GlobalContext";


export const useNotesQuery = () => {
  const {labelId} = useParams()
  const { query } = useGlobalContext()

  const {data, isSuccess, isPending, isError, error} = useQuery<NotesData, Error>({
    queryKey: ["notes", labelId, query],
    queryFn: () => getNotes(labelId || "", query),
  })

  return { data, isSuccess, isPending, isError, error};
}

export default useNotesQuery