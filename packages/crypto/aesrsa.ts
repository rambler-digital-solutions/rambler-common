import {getRandomValues, subtle} from './crypto'
import {
  bufferFromString,
  bufferFromUnicode,
  stringFromBuffer,
  base64urlFromString
} from './buffers'

function generateAESKey() {
  return subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  )
}

async function encryptAES(
  key: CryptoKey,
  initVector: Uint8Array,
  body: string
) {
  const encryptedBody = await subtle.encrypt(
    {name: 'AES-GCM', iv: initVector},
    key,
    bufferFromUnicode(body)
  )

  return base64urlFromString(stringFromBuffer(encryptedBody))
}

function importRSAKey(keyString: string) {
  return subtle.importKey(
    'spki',
    bufferFromString(window.atob(keyString)),
    {
      name: 'RSA-OAEP',
      hash: {name: 'SHA-256'}
    },
    false,
    ['wrapKey']
  )
}

async function encryptRSA(key: CryptoKey, body: CryptoKey) {
  const encryptedBody = await subtle.wrapKey('raw', body, key, {
    name: 'RSA-OAEP'
  } as RsaOaepParams)

  return base64urlFromString(stringFromBuffer(encryptedBody))
}

/** Encrypt with AES and RSA keys */
export async function encryptAESRSA(keyString: string, body: string) {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const initVector = getRandomValues(new Uint8Array(12))
  const initVectorString = base64urlFromString(stringFromBuffer(initVector))

  const [aesKey, rsaKey] = await Promise.all([
    generateAESKey(),
    importRSAKey(keyString)
  ])

  const [encryptedBody, encryptedKey] = await Promise.all([
    encryptAES(aesKey, initVector, body),
    encryptRSA(rsaKey, aesKey)
  ])

  return `${encryptedBody}.${encryptedKey}.${initVectorString}`
}
