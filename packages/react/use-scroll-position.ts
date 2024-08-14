import {useRef, useEffect, DependencyList} from 'react'
import throttle from 'raf-throttle'
import {isSSR} from './ssr'

function getScrollPosition() {
  return isSSR ? 0 : window.pageYOffset
}

/** Listen scroll position */
export function useScrollPosition(
  callback: (current: number, prev: number) => void,
  deps: DependencyList = []
) {
  const scrollPosition = useRef(getScrollPosition())

  useEffect(() => {
    if (isSSR) return

    const handleScroll = throttle((): void => {
      const currentScrollPosition = getScrollPosition()

      callback(currentScrollPosition, scrollPosition.current)

      scrollPosition.current = currentScrollPosition
    })

    window.addEventListener('scroll', handleScroll, {passive: true})

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, deps)
}
