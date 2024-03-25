/* eslint-disable import/no-unused-modules */

/** Local storage item options */
export interface StorageItemOptions {
  /** Use raw value, by default the value is converted to JSON */
  raw?: boolean
}

/** Get an item from local storage */
export const getItem = <T>(
  key: string,
  options: StorageItemOptions = {}
): T => {
  const {raw} = options
  let item

  try {
    const value = window.localStorage.getItem(key)

    item = raw ? value : JSON.parse(value ?? '')
  } catch {}

  return item ?? null
}

/** Put an item to local storage */
export const setItem = <T>(
  key: string,
  value: T,
  options: StorageItemOptions = {}
): void => {
  const {raw} = options

  try {
    const resultValue = raw ? String(value) : JSON.stringify(value)

    window.localStorage.setItem(key, resultValue)
  } catch {}
}

/** Remove an item from local storage */
export const removeItem = (key: string): void => {
  try {
    window.localStorage.removeItem(key)
  } catch {}
}
