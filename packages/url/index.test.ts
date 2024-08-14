import {
  getUrlParams,
  getUrlHashParams,
  addUrlParams,
  removeUrlHash,
  removeUrlNullableParams,
  formatUrl,
  encodeURIComponentRFC3986
} from '.'

test('getUrlParams: valid url', () => {
  const href = 'https://foo.bar?action=login&provider=provider'

  expect(getUrlParams(href)).toEqual({
    action: 'login',
    provider: 'provider'
  })
})

test('getUrlParams: valid url with empty search params', () => {
  const href = 'https://foo.bar'

  expect(getUrlParams(href)).toEqual({})
})

test('getUrlHashParams: valid url', () => {
  const href = 'https://foo.bar#action=login&provider=provider'

  expect(getUrlHashParams(href)).toEqual({
    action: 'login',
    provider: 'provider'
  })
})

test('getUrlHashParams: valid url with empty hash', () => {
  const href = 'https://foo.baz'

  expect(getUrlHashParams(href)).toEqual({})
})

test('addUrlParams with search params', () => {
  expect(
    addUrlParams('https://foo.bar/', {
      logged: false,
      action: 'login',
      provider: 'provider'
    })
  ).toEqual('https://foo.bar/?logged=false&action=login&provider=provider')
})

test('addUrlParams with cleaned search params', () => {
  expect(
    addUrlParams('https://foo.bar/', {
      logged: false,
      action: 'login',
      provider: 'provider',
      test: undefined,
      foobar: null
    })
  ).toEqual('https://foo.bar/?logged=false&action=login&provider=provider')
})

test('addUrlParams with hash', () => {
  expect(
    addUrlParams(
      'https://foo.bar/?test=test#bar=baz',
      {
        logged: false,
        action: 'login',
        provider: 'provider'
      },
      {foo: 'bar'}
    )
  ).toEqual(
    'https://foo.bar/?test=test&logged=false&action=login&provider=provider#bar=baz&foo=bar'
  )
})

test('removeUrlHash', () => {
  const href = 'https://foo.bar/baz/?foo=bar'

  expect(removeUrlHash(href)).toEqual(href)
  expect(removeUrlHash('https://foo.bar/baz/?foo=bar#foo=bar')).toEqual(href)
})

test('should clean query', () => {
  expect(
    removeUrlNullableParams({test: undefined, foo: 'bar', bar: undefined})
  ).toEqual({
    foo: 'bar'
  })
})

test('should format url', () => {
  expect(
    formatUrl({
      pathname: '/login',
      query: {
        email: 'testbar.ru',
        rname: undefined,
        src: null,
        type: 'test',
        back: 'back.ru'
      }
    })
  ).toBe('/login?email=testbar.ru&type=test&back=back.ru')
})

test('should format full url', () => {
  expect(
    formatUrl({
      protocol: 'https:',
      host: 'somehost.com',
      pathname: '/login',
      query: {
        email: 'testbar.ru',
        rname: undefined,
        src: null,
        type: 'test',
        back: 'back.ru'
      }
    })
  ).toBe('https://somehost.com/login?email=testbar.ru&type=test&back=back.ru')
})

test('should encode with RFC 3986 standard', () => {
  expect(encodeURIComponentRFC3986('my file(2).txt')).toBe(
    'my%20file%282%29.txt'
  )
})
