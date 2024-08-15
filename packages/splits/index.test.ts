import {getItem, setItem} from '@rambler-tech/cookie-storage'
import {Splits, SplitsVariations} from '.'

let splits: Splits
let initialVariations: SplitsVariations

setItem('foo', 'bar')

test('initial split', () => {
  const tests = [
    {
      name: 'login',
      variations: [
        {
          name: 'compact',
          probability: [0, 0.5]
        }
      ]
    },
    {
      name: 'phone',
      cookie: 'login',
      variations: [
        {
          name: 'without',
          probability: [0.5, 1]
        }
      ]
    }
  ]

  const options = {
    prefix: 'x_'
  }

  splits = new Splits(tests, options)
  initialVariations = splits.getVariations()

  expect(Object.keys(initialVariations)).toEqual(tests.map((ts) => ts.name))
  expect(initialVariations.login).not.toBe(initialVariations.phone)
  expect(getItem('foo')).toBe('bar')
  expect(getItem('x_login')).toBeTruthy()
})

test('get variations', () => {
  const variations = splits.getVariations()

  expect(variations).toEqual(initialVariations)
  expect(variations.login).not.toBe(variations.phone)
  expect(getItem('foo')).toBe('bar')
  expect(getItem('x_login')).toBeTruthy()
})

test('drop irrelevant cookies', () => {
  const tests = [
    {
      name: 'phone',
      variations: [
        {
          name: 'without',
          probability: [0.5, 1]
        }
      ]
    }
  ]

  const options = {
    prefix: 'x_'
  }

  const nextSplits = new Splits(tests, options)

  nextSplits.getVariations()

  expect(getItem('foo')).toBe('bar')
  expect(getItem('x_phone')).toBeTruthy()
  expect(getItem('x_login')).toBeFalsy()
})

test('wrong settings', () => {
  expect(() => new Splits({} as any)).toThrow(
    'expected `settings.tests` is not empty array'
  )
  expect(
    () =>
      new Splits([
        {
          name: 'phone number'
        }
      ] as any)
  ).toThrow('expected `phone number` contains `A-Za-z0-9_-` symbols only')
  expect(
    () =>
      new Splits([
        {
          name: 'phone',
          variations: null
        }
      ] as any)
  ).toThrow('expected `variations` of `phone` is not empty array')
  expect(
    () =>
      new Splits([
        {
          name: 'phone',
          variations: [
            {
              name: 'short',
              probability: null
            }
          ]
        }
      ] as any)
  ).toThrow('expected `probability` of `phone.short` is array of numbers')
})
