/* eslint-disable import/no-unused-modules */
import {useEffect, useState} from 'react'

const DEFAULT_OPTIONS = {
  threshold: 1,
  once: false
}

/** Use is visible options */
export interface UseIsVisibleOptions extends IntersectionObserverInit {
  /** Track intersection once */
  once: boolean
}

/** Tracks the intersection of an element with its parent or document's viewport. */
export function useIsVisible(
  element: Element,
  options: UseIsVisibleOptions = DEFAULT_OPTIONS
): boolean {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        const thresholds = Array.isArray(observer.thresholds)
          ? observer.thresholds
          : [observer.thresholds]

        entries.forEach((entry) => {
          const isIntersecting =
            entry.isIntersecting &&
            thresholds.some((threshold) => entry.intersectionRatio >= threshold)

          setIsVisible(isIntersecting)

          if (isIntersecting && options.once) {
            observer.disconnect()
          }
        })
      },
      options
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [element, options])

  return isVisible
}
