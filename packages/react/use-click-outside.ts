import {useEffect, RefObject} from 'react'

/** Listen click outside */
export function useClickOutside(
  ref: RefObject<HTMLElement>,
  callback: (...args: any[]) => any
) {
  useEffect(() => {
    let startedInside = false
    let startedWhenMounted = false

    const listener = (event: MouseEvent): void => {
      // Игнорировать событие если `mousedown` или `touchstart` внутри элемента
      if (startedInside || !startedWhenMounted) return
      // Игнорировать если клик по элементу ref или дочерним
      if (!ref.current || ref.current.contains(event.target as HTMLElement))
        return

      callback(event)
    }

    const validateEventStart = (event: any): void => {
      startedWhenMounted = !!ref.current
      startedInside = !!(ref.current && ref.current.contains(event.target))
    }

    document.addEventListener('mousedown', validateEventStart)
    document.addEventListener('touchstart', validateEventStart)
    document.addEventListener('click', listener)

    return () => {
      document.removeEventListener('mousedown', validateEventStart)
      document.removeEventListener('touchstart', validateEventStart)
      document.removeEventListener('click', listener)
    }
  }, [ref, callback])
}
