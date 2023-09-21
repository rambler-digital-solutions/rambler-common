import {get, set, remove, CookieOptions} from 'koo'

/** Cookie storage item options */
export interface CookieItemOptions {
  /** Use the raw value, by default the value is converted to JSON */
  raw?: boolean
}

/** Cookie storage set item options */
export interface SetCookieItemOptions
  extends CookieOptions,
    CookieItemOptions {}

/** Get all items from cookie storage */
export const getAll = (
  options: CookieItemOptions = {}
): Record<string, string> | null => {
  const {raw} = options
  let items

  try {
    items = Object.fromEntries(
      Object.entries(get()).map(([key, value]) => [
        key,
        raw ? value : JSON.parse(value ?? '')
      ])
    )
  } catch {}

  return items ?? null
}

/** Get an item from cookie storage */
export const getItem = <T>(key: string, options: CookieItemOptions = {}): T => {
  const {raw} = options
  let item

  try {
    const value = get(key)

    item = raw ? value : JSON.parse(value ?? '')
  } catch {}

  return item ?? null
}

/** Put an item to cookie storage */
export const setItem = <T>(
  key: string,
  value: T,
  options: SetCookieItemOptions = {}
): void => {
  const {raw, ...cookieOptions} = options

  try {
    const resultValue = raw ? String(value) : JSON.stringify(value)

    set(key, resultValue, cookieOptions)
  } catch {}
}

/** Remove an item from cookie storage */
export const removeItem = (key: string, options?: CookieOptions): void => {
  try {
    remove(key, options)
  } catch {}
}
