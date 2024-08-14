import sha from 'sha.js'
import {getRandomValues} from './crypto'
import {stringFromBuffer, base64urlFromString} from './buffers'

function generateCodeVerifier() {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const typedArray = new Uint8Array(96)
  const codeVerifierBytes = getRandomValues(typedArray)
  const codeVerifierString = stringFromBuffer(codeVerifierBytes)

  return base64urlFromString(codeVerifierString)
}

function generateCodeChallenge(codeVerifier: string) {
  const codeChallengeS256 = sha('sha256').update(codeVerifier)
  const codeChallengeBytes = codeChallengeS256.digest()
  const codeChallengeString = stringFromBuffer(codeChallengeBytes)

  return base64urlFromString(codeChallengeString)
}

/** PKCE data */
export interface PKCE {
  codeVerifier: string
  codeChallenge: string
  codeChallengeMethod: string
}

/** Generate PKCE challenge and verifier */
export function generatePKCE(): PKCE {
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = generateCodeChallenge(codeVerifier)

  return {
    codeVerifier,
    codeChallenge,
    codeChallengeMethod: 'S256'
  }
}
