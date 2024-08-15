import {useState, useRef, useEffect} from 'react'

/** Countdown timer instance */
export interface Timer {
  /** Remaining time */
  remainingTime: number | null
  /** Start timer */
  startTimer(time: number): void
  /** Stop timer */
  stopTimer(): void
}

/** Countdown timer */
export function useCountdownTimer(): Timer {
  const [remainingTime, setRemainingTime] = useState<null | number>(null)
  const timerId = useRef<number | null>()

  const clear = (): void => {
    if (timerId.current) {
      window.clearInterval(timerId.current)
    }
  }

  useEffect(() => {
    return () => clear()
  }, [])

  useEffect(() => {
    if (remainingTime === 0) {
      clear()
    }
  }, [remainingTime])

  const stopTimer = (): void => {
    clear()
    setRemainingTime(0)
  }

  const tick = (): void => {
    setRemainingTime((prevTime) => prevTime && prevTime - 1)
  }

  const startTimer = (time: number): void => {
    clear()
    timerId.current = window.setInterval(tick, 1000)
    setRemainingTime(time)
  }

  return {
    remainingTime,
    stopTimer,
    startTimer
  }
}
