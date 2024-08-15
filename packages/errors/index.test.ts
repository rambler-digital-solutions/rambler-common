import {GenericError} from '.'

test('base error', () => {
  const error = new GenericError('failed')

  expect(error).toBeInstanceOf(Error)
  expect(error).toBeInstanceOf(GenericError)
  expect(error.name).toBe('GenericError')
  expect(error.message).toBe('failed')
  expect(error.code).toBe('unknown')
  expect(error.details).toBeUndefined()
})

test('error with details', () => {
  const error = new GenericError('api failed', {
    code: 'code',
    details: {
      xid: 'xid'
    }
  })

  expect(error).toBeInstanceOf(Error)
  expect(error).toBeInstanceOf(GenericError)
  expect(error.name).toBe('GenericError')
  expect(error.message).toBe('api failed')
  expect(error.code).toBe('code')
  expect(error.details).toEqual({xid: 'xid'})
})
