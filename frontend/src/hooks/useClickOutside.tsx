import { Dispatch, RefObject, SetStateAction, useEffect } from 'react'



const useClickOutside = (
  ref: RefObject<HTMLElement>,
  states: boolean[],
  setters: Dispatch<SetStateAction<boolean>>[]
): void => {

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        event.stopPropagation()
        if (states.some(state => state)) {
          setters.forEach(setState => {
            setState(false)
          })
        }
      }
    }
    document.addEventListener("click", handleClickOutside, true)

    return () => document.removeEventListener("click", handleClickOutside, true)
  }, [states, ref, setters])
}
export default useClickOutside
