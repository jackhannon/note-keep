import { RefObject, useEffect } from 'react'



const useClickOutside = (
  ref: RefObject<HTMLElement>,
  handler: (event: MouseEvent) => void,
  trigger: boolean = true
): void => {

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event)
      }
    }
    if (trigger) {
      document.addEventListener("click", handleClickOutside, true)
    }

    return () => document.removeEventListener("click", handleClickOutside, true)
  }, [ref, handler, trigger])
}
export default useClickOutside
