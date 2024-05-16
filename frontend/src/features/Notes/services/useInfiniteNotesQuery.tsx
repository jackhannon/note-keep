import { useInfiniteQuery } from "@tanstack/react-query"
import { getNotes } from "./noteServices";
import { NoteType } from "../../../interfaces";
import { useGlobalContext } from "../../../context/GlobalContext";
import { AxiosError } from "axios";
import { useDebounce } from '@uidotdev/usehooks';


const useInfiniteNotesQuery = () => {
  const { query, currentLabel } = useGlobalContext()
  const debouncedQuery = useDebounce(query, 500); // Debounce the query input

  const {data, fetchNextPage, isFetchingNextPage, hasNextPage, isSuccess, isPending, isError, error} = useInfiniteQuery<NoteType[], AxiosError>({
    queryKey: ["notes", currentLabel._id, debouncedQuery],
    queryFn: ({pageParam = 1}) => getNotes(currentLabel._id || "", query, Number(pageParam)),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 0 ? undefined : allPages.length + 1;
    }
  })

  return { data, isSuccess, isPending, isError, error, fetchNextPage, isFetchingNextPage, hasNextPage};
}



export default useInfiniteNotesQuery