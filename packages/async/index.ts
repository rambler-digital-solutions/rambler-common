/* eslint-disable import/no-unused-modules */

const RETRIES_LEFT = 3
const INTERVAL = 500

export type PromiseFactory<T> = (...args: any[]) => Promise<T>

/** Retry options */
export interface RetryOptions {
  /** Maximum amount of times to retry the operation, default is 3 */
  retries?: number
  /** Number of milliseconds before starting the retry, default is 500 */
  timeout?: number
  /** Check an error to need retry, by default retry on every error */
  shouldRetry?: (error: Error) => boolean
  /** AbortSignal instance to abort retry via an AbortController */
  signal?: AbortSignal
}

/** Retry function call */
export function retry<T>(
  factory: PromiseFactory<T>,
  options: RetryOptions = {}
): PromiseFactory<T> {
  let {retries = RETRIES_LEFT} = options
  const {timeout = INTERVAL, shouldRetry = () => true, signal} = options

  async function call(...args: any[]): Promise<T> {
    try {
      return await factory(...args)
    } catch (error: any) {
      if (--retries < 1 || !shouldRetry(error)) {
        throw error
      }

      await wait(timeout, signal)

      return call(...args)
    }
  }

  return (...args: any[]): Promise<T> => call(...args)
}

/** Wait function call */
export function wait(timeout: number, signal?: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(resolve, timeout)

    signal?.addEventListener('abort', () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      reject(new DOMException('The user aborted a timeout.', 'AbortError'))
    })
  })
}
