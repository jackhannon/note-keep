import { useQuery } from "@tanstack/react-query"
import { getNotes } from "./noteServices";
import { NotesData } from "../../../interfaces";
import { useGlobalContext } from "../../../context/GlobalContext";


const useNotesQuery = () => {
  const { query, currentLabel } = useGlobalContext()

  const {data, isSuccess, isPending, isError, error} = useQuery<NotesData, Error>({
    queryKey: ["notes", currentLabel._id, query],
    queryFn: () => getNotes(currentLabel._id || "", query),
  })

  return { data, isSuccess, isPending, isError, error};
}

export default useNotesQuery