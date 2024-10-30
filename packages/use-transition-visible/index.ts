/* eslint-disable import/no-unused-modules */
import {useRef, useState, useEffect} from 'react'

/** Controls the visibility and mounting state of a component using transition effects. */
export const useTransitionVisible = (isOpen: boolean) => {
  const refNode = useRef<HTMLDivElement>(null)

  const [isMounted, setIsMounted] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true)
        })
      })
    } else {
      setIsVisible(false)
    }

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target === refNode.current && !isOpen) {
        setIsMounted(false)
      }
    }

    const node = refNode.current

    node?.addEventListener('transitionend', handleTransitionEnd)

    return () => {
      node?.removeEventListener('transitionend', handleTransitionEnd)
    }
  }, [isOpen])

  return {
    refNode,
    isMounted,
    isVisible
  }
}
