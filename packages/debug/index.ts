/* eslint-disable import/no-unused-modules */
import {getUrlParams} from '@rambler-tech/url'
import {removeItem, setItem, getItem} from '@rambler-tech/local-storage'

const RESET_DEBUG_LOCAL_STORAGE_VALUE = 'unset'

/**
 * Init debug mode from URL
 *
 * ```ts
 * initDebug('https://example.com?debug=value')
 * ```
 *
 * Possible value:
 * * `*` - Include all debug namespaces
 * * `unset` - Reset debug value from local storage
 * * `value` - Write debug value into local storage
 */
export function initDebug(href?: string) {
  if (typeof window === 'undefined') {
    return
  }

  const {debug: queryParam} = getUrlParams(href ?? window.location.href)
  const storageParam = getItem('debug', {raw: true})

  if (
    !queryParam ||
    typeof queryParam !== 'string' ||
    storageParam === queryParam ||
    (!storageParam && queryParam === RESET_DEBUG_LOCAL_STORAGE_VALUE)
  ) {
    return
  }

  if (queryParam === RESET_DEBUG_LOCAL_STORAGE_VALUE) {
    removeItem('debug')
  } else {
    setItem('debug', queryParam, {raw: true})
  }
}

export {default as createDebug} from 'debug'
