/* eslint-disable import/no-unused-modules */

/** Generic error options */
export interface GenericErrorInput {
  code?: number | string
  details?: Record<string, any>
}

/**
 * Generic error
 *
 * Base usage
 * ```ts
 * new GenericError('failed')
 * ```
 *
 * Usage with details
 * ```ts
 * new GenericError('api failed', {
 *   code: 'account_suspended',
 *   details: {
 *     xid: 'k1k2jn31kjnasxa9'
 *   }
 * })
 * ```
 */
export class GenericError extends Error {
  code: GenericErrorInput['code']
  details?: GenericErrorInput['details']

  /** Generic error constructor */
  constructor(message: string, input?: GenericErrorInput) {
    super()
    this.name = 'GenericError'
    this.message = message.toString().toLowerCase()
    this.code = input?.code ?? 'unknown'
    this.details = input?.details
    Object.setPrototypeOf(this, GenericError.prototype)
  }
}
