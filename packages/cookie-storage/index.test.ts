import {getAll, getItem, setItem, removeItem} from './'

const TEST_VALUES: Record<string, any> = {
  string: 'bar',
  boolean: true,
  number: 1,
  object: {foo: true},
  array: [1, 2, 'asd']
}

Object.entries(TEST_VALUES).forEach(([key, value]) => {
  test(`cookies ${key}`, () => {
    expect(getItem(key)).toBeNull()
    expect(getAll()).toBeNull()
    setItem(key, value)
    expect(getItem(key)).toEqual(value)
    expect(getAll()).toEqual({[key]: value})
    removeItem(key)
    expect(getItem(key)).toBeNull()
    expect(getAll()).toBeNull()
  })

  test(`cookies raw ${key}`, () => {
    expect(getItem(`raw${key}`, {raw: true})).toBeNull()
    expect(getAll({raw: true})).toBeNull()
    setItem(`raw${key}`, value, {raw: true})
    expect(getItem(`raw${key}`, {raw: true})).toEqual(String(value))
    expect(getAll({raw: true})).toEqual({[`raw${key}`]: String(value)})
    removeItem(`raw${key}`)
    expect(getItem(`raw${key}`, {raw: true})).toBeNull()
    expect(getAll({raw: true})).toBeNull()
  })
})
