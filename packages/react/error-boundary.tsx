import {ErrorInfo, PureComponent} from 'react'

/** Error boundary props */
export interface ErrorBoundaryProps {
  /** Error callback */
  onError: (error: Error, errorInfo: Record<string, any>) => void
  /** Fallback that shows on error */
  fallback: JSX.Element
  /** Children to follow errors */
  children: JSX.Element
}

interface ErrorBoundaryState {
  isError: boolean
}

/** Error boundary */
export class ErrorBoundary extends PureComponent<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state = {
    isError: false
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {isError: true}
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const {onError} = this.props

    onError(error, errorInfo)
  }

  render(): JSX.Element {
    const {isError} = this.state
    const {fallback, children} = this.props

    if (isError) {
      return fallback
    }

    return children
  }
}
