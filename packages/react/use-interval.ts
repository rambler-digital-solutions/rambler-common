import {useEffect, useRef} from 'react'

/** Start interval */
export function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const tick = (): void => savedCallback.current?.()
    const id = window.setInterval(tick, delay)

    return () => window.clearInterval(id)
  }, [delay])
}
