import {useState, useEffect} from 'react'
import throttle from 'raf-throttle'
import {isSSR} from './ssr'

/** Viewport info */
export interface Viewport {
  width: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

const BREAKPOINT = 768

export function useViewport(breakpoints?: [number, number]): Viewport
export function useViewport(breakpoints?: [number]): Omit<Viewport, 'isTablet'>

/** Listen viewport change */
export function useViewport(
  breakpoints: [number, number] | [number] = [BREAKPOINT]
): Viewport | Omit<Viewport, 'isTablet'> {
  const [mobile, desktop] = breakpoints
  const [width, setWidth] = useState(isSSR ? 0 : window.innerWidth)

  useEffect(() => {
    const updateWidth = throttle(() => {
      setWidth(window.innerWidth)
    })

    window.addEventListener('resize', updateWidth)

    return () => {
      window.removeEventListener('resize', updateWidth)
    }
  }, [])

  if (typeof desktop === 'number') {
    return {
      width,
      isMobile: width < mobile,
      isTablet: width >= mobile && width < desktop,
      isDesktop: width >= desktop
    }
  }

  return {
    width,
    isMobile: width < mobile,
    isDesktop: width >= mobile
  }
}
