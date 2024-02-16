import { RefObject, useEffect } from 'react'



const useClickOutside = (
  ref: RefObject<HTMLElement>,
  handler: () => void,
  trigger: boolean = true
): void => {

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        event.stopPropagation()
        handler()
      }
    }
    if (trigger) {
      document.addEventListener("click", handleClickOutside, true)
    }

    return () => document.removeEventListener("click", handleClickOutside, true)
  }, [ref, handler, trigger])
}
export default useClickOutside
