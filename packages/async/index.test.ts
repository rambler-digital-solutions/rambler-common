import {retry, wait} from '.'

test('retry resolved promise', async () => {
  const fn = jest.fn((...args) => Promise.resolve(args))
  const args = [1, 2, 3]
  const result = await retry(fn)(...args)

  expect(result).toEqual(args)
  expect(fn).toHaveBeenCalledTimes(1)
})

test('retry rejected and last resolved promise', async () => {
  let counter = 0
  const fn = jest.fn((...args) =>
    counter++ > 1 ? Promise.resolve(args) : Promise.reject(new Error('error'))
  )
  const args = [1, 2, 3]
  const result = await retry(fn, {retries: 3, timeout: 10})(...args)

  expect(result).toEqual(args)
  expect(fn).toHaveBeenCalledTimes(3)
})

test('retry rejected and ignore rejected with specific error', async () => {
  let counter = 0
  const fn = jest.fn(() =>
    Promise.reject(
      new Error(counter++ > 0 ? 'aborted by timeout' : 'yet another error')
    )
  )

  const error = await retry(fn, {
    retries: 3,
    timeout: 10,
    shouldRetry: (error) => !error.toString().match(/aborted/)
  })().catch((error) => error)

  expect(error.message).toBe('aborted by timeout')
  expect(fn).toHaveBeenCalledTimes(2)
})

test('retry rejected promise', async () => {
  const fn = jest.fn(() => Promise.reject(new Error('failed')))
  const error = await retry(fn, {retries: 3, timeout: 10})().catch(
    (error) => error
  )

  expect(error.message).toBe('failed')
  expect(fn).toHaveBeenCalledTimes(3)
})

test('abort retry', async () => {
  const abortController = new AbortController()
  const fn = jest.fn(() => Promise.reject(new Error('failed')))
  const promise = retry(fn, {
    retries: 3,
    timeout: 10,
    signal: abortController.signal
  })()

  // NOTE: simulate microtask to abort wait after first attempt
  await Promise.resolve().then(() => abortController.abort())

  const error = await promise.catch((error) => error)

  expect(error.message).toBe('The user aborted a timeout.')
  expect(fn).toHaveBeenCalledTimes(1)
})

test('wait timeout', () => {
  jest.useFakeTimers()
  jest.spyOn(global, 'setTimeout')

  const promise = wait(1000)

  jest.advanceTimersByTime(1000)

  expect(promise).resolves.toBeUndefined()
})

test('aborted wait timeout', () => {
  const abortController = new AbortController()
  const promise = wait(1000, abortController.signal)

  abortController.abort()

  expect(promise).rejects.toThrow('The user aborted a timeout.')
})
