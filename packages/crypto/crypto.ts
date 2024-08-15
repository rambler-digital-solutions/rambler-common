const crypto =
  typeof window !== 'undefined'
    ? window.crypto || window.msCrypto
    : (null as unknown as Crypto)

/** Web Crypto API */
export const subtle = crypto?.subtle || crypto?.webkitSubtle

/** Check is Web Crypto supported */
export function isSupported() {
  return !!crypto
}

/** Typed array */
export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array

/** Get cryptographically strong random values */
export function getRandomValues<T extends TypedArray>(typedArray: T): T {
  return crypto.getRandomValues(typedArray)
}
