/* eslint-disable import/no-unused-modules */

/** Session storage item options */
export interface StorageItemOptions {
  /** Use raw value, by default the value is converted to JSON */
  raw?: boolean
}

/** Get an item from session storage */
export const getItem = <T>(
  key: string,
  options: StorageItemOptions = {}
): T => {
  const {raw} = options
  let item

  try {
    const value = window.sessionStorage.getItem(key)

    item = raw ? value : JSON.parse(value ?? '')
  } catch {}

  return item ?? null
}

/** Put an item to session storage */
export const setItem = <T>(
  key: string,
  value: T,
  options: StorageItemOptions = {}
): void => {
  const {raw} = options

  try {
    const resultValue = raw ? String(value) : JSON.stringify(value)

    window.sessionStorage.setItem(key, resultValue)
  } catch {}
}

/** Remove an item from session storage */
export const removeItem = (key: string): void => {
  try {
    window.sessionStorage.removeItem(key)
  } catch {}
}
