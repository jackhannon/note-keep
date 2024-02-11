import { Dispatch, RefObject, SetStateAction, useEffect } from 'react'



const useClickOutside = (
  ref: RefObject<HTMLElement>,
  states: boolean[],
  setters: Dispatch<SetStateAction<boolean>>[]
): void => {

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (states.some(state => state)) {
          setters.forEach(setState => {
            setState(false)
          })
        }
      }
    }
    document.addEventListener("click", handleClickOutside)

    return () => document.removeEventListener("click", handleClickOutside)
  }, [state, ref, setters])
}
export default useClickOutside