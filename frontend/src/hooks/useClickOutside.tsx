import { RefObject, useEffect } from 'react'



const useClickOutside = (
  refs: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  handler: (event: MouseEvent) => void,
  trigger: boolean = true
): void => {

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (Array.isArray(refs)) {
        if (!refs.some(ref => ref.current && ref.current.contains(event.target as Node))) {
          handler(event)
        }
      } else {
        if (refs.current && !refs.current.contains(event.target as Node)) {
          handler(event)
        }
      }
    }
    if (trigger) {
      document.addEventListener("click", handleClickOutside, true)
    }

    return () => document.removeEventListener("click", handleClickOutside, true)
  }, [refs, handler, trigger])
}
export default useClickOutside
