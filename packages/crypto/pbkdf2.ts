import md5 from 'md5'
import {subtle} from './crypto'
import {bufferFromString, stringFromBuffer} from './buffers'

/** Derive PBKDF2 key */
export async function derivePBKDF2Key(
  input: string,
  {length = 2048, ...creds}
): Promise<string> {
  const inputBase64 = window.btoa(input)
  const inputBuffer = bufferFromString(inputBase64)
  const inputCryptoKey = await subtle.importKey(
    'raw',
    inputBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  )

  const saltBase64 = window.btoa(creds.salt)
  const saltBuffer = bufferFromString(saltBase64)

  const key = await subtle.deriveKey(
    {
      name: 'PBKDF2',
      hash: 'SHA-1',
      salt: saltBuffer,
      iterations: 8096
    },
    inputCryptoKey,
    {name: 'HMAC', hash: {name: 'SHA-1'}, length},
    true,
    ['sign']
  )

  const keyBuffer = await subtle.exportKey('raw', key)
  const keyBase64 = window.btoa(stringFromBuffer(keyBuffer))

  if (!creds.token) {
    return keyBase64
  }

  return md5(keyBase64 + creds.token)
}
