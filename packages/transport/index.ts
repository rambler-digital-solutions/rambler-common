/* eslint-disable import/no-unused-modules */

const OK = 200

/** Request options */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  /** Request query params */
  query?: Record<string, string>
  /** Request body */
  body?: Record<string, any> | BodyInit | null
  /** Request timeout (ms) */
  timeout?: number
}

/** Request */
export async function request<T>(
  url = '',
  requestOptions: RequestOptions = {}
): Promise<T> {
  const {
    method = 'get',
    query = {},
    body,
    timeout,
    headers,
    ...options
  } = requestOptions

  const requestInit: RequestInit = {
    method,
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  let requestUrl = url

  if (query) {
    const queryString = new URLSearchParams(query).toString()

    if (queryString) {
      requestUrl += `?${queryString}`
    }
  }

  if (body) {
    requestInit.body =
      body instanceof FormData || typeof body === 'string'
        ? body
        : JSON.stringify(body)
  }

  if (timeout != null) {
    const controller = new AbortController()

    requestInit.signal = controller.signal
    window.setTimeout(() => controller.abort(), timeout)
  }

  const response = await fetch(requestUrl, requestInit)

  if (response.status !== OK) {
    throw new Error(
      `Failed to fetch: ${response.status} ${response.statusText}`
    )
  }

  return response.json()
}

/** Request factory */
export function createRequest(
  url = '',
  options: RequestOptions = {}
): typeof request {
  return <T>(endpoint = '', requestOptions: RequestOptions = {}) =>
    request<T>(url + endpoint, {
      ...options,
      ...requestOptions
    })
}
