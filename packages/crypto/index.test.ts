import {randomBytes, createHash} from 'crypto'
import {
  bufferFromString,
  stringFromBuffer,
  bufferFromUnicode,
  unicodeFromBuffer,
  base64urlFromString,
  stringFromBase64Url,
  concatBuffers,
  deriveBcryptKey
} from '.'
import {setRandomFallback, genSaltSync, hash} from './bcryptjs'

test('string and buffer transforms', () => {
  const string = 'Foobar'
  const buffer = new ArrayBuffer(42)

  expect(stringFromBuffer(bufferFromString(string))).toEqual(string)
  expect(bufferFromString(stringFromBuffer(buffer))).toEqual(buffer)
})

test('unicode and buffer transforms', () => {
  const string = 'Foobar'
  const cyrillic = 'Привет'
  const buffer = new ArrayBuffer(42)

  expect(unicodeFromBuffer(bufferFromUnicode(string))).toEqual(string)
  expect(unicodeFromBuffer(bufferFromUnicode(cyrillic))).toEqual(cyrillic)
  expect(bufferFromUnicode(unicodeFromBuffer(buffer))).toEqual(buffer)
})

test('string and base64url transforms', () => {
  const string = 'Foobar=+/'
  const base64url = 'Rm9vYmFyPSsv'

  expect(stringFromBase64Url(base64urlFromString(string))).toEqual(string)
  expect(base64urlFromString(stringFromBase64Url(base64url))).toEqual(base64url)
})

test('concat buffers', () => {
  const buffer1 = new Uint8Array([1, 2])
  const buffer2 = new Uint8Array([3, 4])

  expect(new Uint8Array(concatBuffers(buffer1, buffer2))).toEqual(
    new Uint8Array([1, 2, 3, 4])
  )
})

test('deriveBcryptKey', async () => {
  const input = 'foo'
  const token = 'bar'

  setRandomFallback(randomBytes)

  const salt = genSaltSync(16)

  const hashString = await new Promise((resolve, reject) => {
    hash(input, salt, (error, hash) => {
      if (error) {
        reject(error)
      } else {
        resolve(hash)
      }
    })
  })

  const result = await deriveBcryptKey(input, {salt, token})

  expect(result).toEqual(
    createHash('sha512')
      .update(hashString + token)
      .digest('hex')
  )
})
