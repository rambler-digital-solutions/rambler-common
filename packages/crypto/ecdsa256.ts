import {getRandomValues, subtle} from './crypto'
import {
  bufferFromString,
  stringFromBuffer,
  base64urlFromString,
  stringFromBase64Url,
  concatBuffers
} from './buffers'

/** ECDSA256 attestation */
export interface ECDSA256Attestation {
  id: string
  response: {
    signature: string
    authenticatorDataBytes: string
    clientDataJson: string
  }
}

/** Get ECDSA256 attestation */
export async function getECDSA256Attestation(
  challenge: string,
  identifier: string,
  key: string
): Promise<ECDSA256Attestation> {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const authenticatorData = new Uint8Array(10)

  getRandomValues(authenticatorData)

  const clientData = {
    type: 'webauthn.get',
    origin: window.location.origin,
    challenge
  }

  const clientDataBytes = bufferFromString(JSON.stringify(clientData))
  const clientDataBytesHash = await subtle.digest('SHA-256', clientDataBytes)
  const signatureData = concatBuffers(
    new Uint8Array(authenticatorData),
    new Uint8Array(clientDataBytesHash)
  )

  const privateKeyPortable = bufferFromString(stringFromBase64Url(key))
  const privateKey = await subtle.importKey(
    'pkcs8',
    privateKeyPortable,
    {
      name: 'ECDSA',
      namedCurve: 'P-256'
    },
    true,
    ['sign']
  )
  const signature = await subtle.sign(
    {
      name: 'ECDSA',
      hash: 'SHA-256'
    },
    privateKey,
    signatureData
  )

  return {
    id: identifier,
    response: {
      signature: base64urlFromString(stringFromBuffer(signature)),
      authenticatorDataBytes: base64urlFromString(
        stringFromBuffer(authenticatorData)
      ),
      clientDataJson: base64urlFromString(stringFromBuffer(clientDataBytes))
    }
  }
}

/** ECDSA256 key */
export interface ECDSA256Key {
  privateKey: string
  publicKey: {
    x: string
    y: string
  }
}

/** Get ECDSA256 key */
export async function generateECDSA256Key(): Promise<ECDSA256Key> {
  const {privateKey: privateKey, publicKey: publicKey} =
    await subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256'
      },
      true,
      ['sign', 'verify']
    )
  const privateKeyBuffer = await subtle.exportKey(
    'pkcs8',
    privateKey as CryptoKey
  )
  const privateKeyString = base64urlFromString(
    stringFromBuffer(privateKeyBuffer)
  )

  const {x, y} = await subtle.exportKey('jwk', publicKey as CryptoKey)

  return {
    privateKey: privateKeyString,
    publicKey: {
      x: x || '',
      y: y || ''
    }
  }
}
