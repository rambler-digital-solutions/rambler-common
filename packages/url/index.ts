/* eslint-disable import/no-unused-modules */

export type ParsedQuery<T = string> = Record<string, T | T[] | null | undefined>

export type Query = Record<string, any>

interface UrlObject {
  protocol?: string | null
  host?: string | null
  pathname?: string | null
  query?: string | Query | null
}

/** Format URL to string */
export function formatUrl(urlObject: UrlObject): string {
  const {protocol, host, pathname, query} = urlObject

  let cleanedQueryString

  if (query && typeof query === 'object') {
    // NOTE: remove undefined or null values from query
    const cleanedQuery = removeUrlNullableParams(query)

    cleanedQueryString = new URLSearchParams(cleanedQuery).toString()
  } else {
    cleanedQueryString = query
  }

  return (
    (protocol ? `${protocol}//` : '') +
    (host ?? '') +
    pathname +
    (cleanedQueryString ? `?${cleanedQueryString}` : '')
  )
}

/** Get URL query params */
export function getUrlParams(url: string): ParsedQuery {
  const searchParams: ParsedQuery = {}

  const {searchParams: iterableSearchParams} = new URL(url)

  iterableSearchParams.forEach((value, key) => {
    searchParams[key] = value
  })

  return searchParams
}

/** Get URL hash params */
export function getUrlHashParams(url: string): ParsedQuery {
  const hashParams: ParsedQuery = {}

  const {hash} = new URL(url)
  const iterableHashParams = new URLSearchParams(hash.substring(1))

  iterableHashParams.forEach((value, key) => {
    hashParams[key] = value
  })

  return hashParams
}

/** Add URL query params */
export function addUrlParams(
  url: string,
  searchParams: Query,
  hashParams?: Query
): string {
  if (
    !Object.keys(searchParams).length &&
    (!hashParams || !Object.keys(hashParams).length)
  )
    return url

  const {protocol, host, pathname} = new URL(url)

  const initialSearchParams = getUrlParams(url)
  const mergedSearchParams = removeUrlNullableParams({
    ...initialSearchParams,
    ...searchParams
  })

  const search = new URLSearchParams(mergedSearchParams).toString()
  const urlSearch = search ? `?${search}` : ''

  const initialHashParams = getUrlHashParams(url)
  const mergedHashParams = removeUrlNullableParams({
    ...initialHashParams,
    ...hashParams
  })

  const hash = new URLSearchParams(mergedHashParams).toString()
  const urlHash = hash ? `#${hash}` : ''

  return `${protocol}//${host}${pathname}${urlSearch}${urlHash}`
}

/** Remove URL nullable query params (`null` or `undefined`) */
export function removeUrlNullableParams<T extends Query>(query: T): T {
  const resultQuery: Query = {}

  Object.keys(query).forEach((key) => {
    if (query[key] != null) {
      resultQuery[key] = query[key]
    }
  })

  return resultQuery as T
}

/** Remove URL hash */
export function removeUrlHash(url: string): string {
  const {protocol, host, pathname, search} = new URL(url)

  return `${protocol}//${host}${pathname}${search}`
}

/**
 * Encode URI for RFC3986
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
 */
export function encodeURIComponentRFC3986(value: string): string {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    (c) => `%${c.charCodeAt(0).toString(16)}`
  )
}
