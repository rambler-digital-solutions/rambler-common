import {getItem, setItem} from '@rambler-tech/local-storage'
import {initDebug} from '.'

class LocalStorage implements LocalStorage {
  map: {[key: string]: any} = {}
  getItem(key: string): void {
    return this.map[key]
  }
  setItem(key: string, value: any): void {
    this.map[key] = value
  }
  removeItem(key: string): void {
    delete this.map[key]
  }
}

Object.defineProperty(window, 'localStorage', {
  value: new LocalStorage()
})

test('reset local storage debug value', () => {
  setItem('debug', 'test', {raw: true})

  expect(getItem('debug', {raw: true})).toBe('test')

  initDebug('https://foobar.ru?debug=unset')

  expect(getItem('debug', {raw: true})).toBeNull()
})

test('use window.location.href value', () => {
  Object.defineProperty(window, 'location', {
    value: {
      href: 'https://test.ru?debug=bar'
    },
    writable: true
  })

  setItem('debug', 'foo', {raw: true})

  expect(getItem('debug', {raw: true})).toBe('foo')

  initDebug()

  expect(getItem('debug', {raw: true})).toBe('bar')
})

test('use debug value from initDebug arg', () => {
  setItem('debug', 'test', {raw: true})

  expect(getItem('debug', {raw: true})).toBe('test')

  initDebug('https://foobar.ru?debug=foo')

  expect(getItem('debug', {raw: true})).toBe('foo')
})
