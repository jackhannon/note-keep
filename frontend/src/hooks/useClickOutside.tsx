import { RefObject, useEffect } from 'react'



const useClickOutside = (
  ref: RefObject<HTMLElement>,
  handler: () => void
): void => {

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        event.stopPropagation()
        handler()
      }
    }
    document.addEventListener("click", handleClickOutside, true)

    return () => document.removeEventListener("click", handleClickOutside, true)
  }, [ref, handler])
}
export default useClickOutside
