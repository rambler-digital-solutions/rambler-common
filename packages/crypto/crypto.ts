const crypto =
  typeof window !== 'undefined'
    ? window.crypto || window.msCrypto
    : (null as unknown as Crypto)

export const subtle = crypto?.subtle || crypto?.webkitSubtle

export function isSupported() {
  return !!crypto
}

type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array

export function getRandomValues<T extends TypedArray>(typedArray: T): T {
  return crypto.getRandomValues(typedArray)
}
