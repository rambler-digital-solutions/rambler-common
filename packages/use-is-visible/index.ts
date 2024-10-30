/* eslint-disable import/no-unused-modules */
import {useEffect, useState} from 'react'

/** Tracks the intersection of an element with its parent or document's viewport. */
export function useIsVisible(
  element: Element,
  options: IntersectionObserverInit = {threshold: 1}
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
