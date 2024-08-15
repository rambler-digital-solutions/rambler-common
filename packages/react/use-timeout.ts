import {useEffect, useRef} from 'react'

/** Start timeout */
export function useTimeout(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const tick = (): void => savedCallback.current?.()
    const timerId = window.setTimeout(tick, delay)

    return () => window.clearTimeout(timerId)
  }, [delay])
}
