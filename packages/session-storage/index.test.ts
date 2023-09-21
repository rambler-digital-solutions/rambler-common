import {getItem, setItem, removeItem} from './'

class SessionStorage implements SessionStorage {
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

Object.defineProperty(window, 'sessionStorage', {
  value: new SessionStorage()
})

const TEST_VALUES: Record<string, any> = {
  string: 'bar',
  boolean: true,
  number: 1,
  object: {foo: true},
  array: [1, 2, 'asd']
}

Object.entries(TEST_VALUES).forEach(([key, value]) => {
  test(`sessionStorage ${key}`, () => {
    expect(getItem(key)).toBeNull()
    setItem(key, value)
    expect(getItem(key)).toEqual(value)
    removeItem(key)
    expect(getItem(key)).toBeNull()
  })

  test(`sessionStorage raw ${key}`, () => {
    expect(getItem(`raw${key}`, {raw: true})).toBeNull()
    setItem(`raw${key}`, value, {raw: true})
    expect(getItem(`raw${key}`, {raw: true})).toEqual(String(value))
    removeItem(`raw${key}`)
    expect(getItem(`raw${key}`, {raw: true})).toBeNull()
  })
})
