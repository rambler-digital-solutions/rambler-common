import {getItem, setItem, removeItem} from '.'

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

const TEST_VALUES: Record<string, any> = {
  string: 'bar',
  boolean: true,
  number: 1,
  object: {foo: true},
  array: [1, 2, 'asd']
}

Object.entries(TEST_VALUES).forEach(([key, value]) => {
  test(`localStorage ${key}`, () => {
    expect(getItem(key)).toBeNull()
    setItem(key, value)
    expect(getItem(key)).toEqual(value)
    removeItem(key)
    expect(getItem(key)).toBeNull()
  })

  test(`localStorage raw ${key}`, () => {
    expect(getItem(`raw${key}`, {raw: true})).toBeNull()
    setItem(`raw${key}`, value, {raw: true})
    expect(getItem(`raw${key}`, {raw: true})).toEqual(String(value))
    removeItem(`raw${key}`)
    expect(getItem(`raw${key}`, {raw: true})).toBeNull()
  })
})
