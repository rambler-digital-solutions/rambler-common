import sha from 'sha.js'
import {hash} from './bcryptjs'

/** bcrypt derivation params */
export interface DeriveBcryptKeyParams {
  salt: string
  token: string
}

/** Derive key with bcrypt */
export async function deriveBcryptKey(
  input: string,
  {salt, token}: DeriveBcryptKeyParams
) {
  const hashString: string = await new Promise((resolve, reject) => {
    hash(input, salt, (error, hash) => {
      if (error) {
        reject(error)
      } else {
        resolve(hash)
      }
    })
  })

  if (!token) {
    return hashString
  }

  return sha('sha512')
    .update(hashString + token)
    .digest('hex')
}
