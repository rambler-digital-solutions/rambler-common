/* eslint-disable import/no-unused-modules */

import {useRef, useState, useEffect} from 'react'

const TIMEOUT_DELAY = 50

export const useTransitionVisible = (isOpen: boolean) => {
  const timeoutId = useRef<NodeJS.Timeout>()
  const refNode = useRef<HTMLDivElement>(null)

  const [isMounted, setMounted] = useState(false)
  const [isVisible, setVisible] = useState(false)

  useEffect(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }

    if (isOpen) {
      setMounted(true)

      timeoutId.current = setTimeout(() => {
        setVisible(true)
      }, TIMEOUT_DELAY)

      return
    }

    setVisible(false)

    // На тот случай, если у элемента нет анимации через transition,
    // размонтируем через 50ms
    timeoutId.current = setTimeout(() => {
      setMounted(false)
    }, TIMEOUT_DELAY)

    if (!refNode.current) {
      return
    }

    // Если у элемента есть анимации через transition,
    // то отменим размонтирование через 50ms
    const transitionrun = (event: TransitionEvent) => {
      const node = refNode?.current

      if (event.target === node) {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current)
        }

        node?.removeEventListener('transitionrun', transitionrun)
      }
    }

    // Размонтируем после окончания анимации
    const transitionend = (event: TransitionEvent) => {
      const node = refNode?.current

      // Проверяем, что анимация была на самом элементе, а не на его детях
      if (event.target === node) {
        setMounted(false)
        node?.removeEventListener('transitionend', transitionend)
      }
    }

    refNode.current.addEventListener('transitionend', transitionend)
    refNode.current.addEventListener('transitionrun', transitionrun)

    return () => {
      const node = refNode.current

      if (node) {
        node.removeEventListener('transitionend', transitionend)
        node.removeEventListener('transitionrun', transitionrun)
      }
    }
  }, [isOpen])

  return {
    refNode,
    isMounted,
    isVisible
  }
}
