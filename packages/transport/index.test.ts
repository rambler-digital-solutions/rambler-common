import {request} from '.'

const fetchMock = jest.fn(() =>
  Promise.resolve({
    status: 200,
    json: () => Promise.resolve({data: 'baz'})
  })
) as jest.Mock

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation(fetchMock)
})

test('base request api', async () => {
  await request('/api', {})

  expect(fetchMock).toHaveBeenCalledWith('/api', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  })
})

test('request api with query', async () => {
  await request('/api', {
    query: {
      foo: 'bar'
    }
  })

  expect(fetchMock).toHaveBeenCalledWith('/api?foo=bar', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  })
})

test('request api with query', async () => {
  await request('/api', {
    method: 'post',
    body: {
      foo: 'bar'
    }
  })

  expect(fetchMock).toHaveBeenCalledWith('/api', {
    method: 'post',
    body: '{"foo":"bar"}',
    headers: {
      'Content-Type': 'application/json'
    }
  })
})

test('request api with timeout', async () => {
  await request('/api', {
    timeout: 1000
  })

  expect(fetchMock).toHaveBeenCalledWith('/api', {
    method: 'get',
    signal: expect.any(AbortSignal),
    headers: {
      'Content-Type': 'application/json'
    }
  })
})

afterEach(() => {
  jest.clearAllMocks()
})
