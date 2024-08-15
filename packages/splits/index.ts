/* eslint-disable import/no-unused-modules */
import {
  getAll,
  getItem,
  setItem,
  removeItem,
  type SetCookieItemOptions
} from '@rambler-tech/cookie-storage'

const DEFAULT_OPTIONS: SplitsOptions = {
  path: '/',
  expires: 182,
  domain: `.${window.location.hostname}`,
  samesite: 'none',
  secure: true
}

/** Split test declaration */
export interface SplitTest {
  /** Test name */
  name: string
  /** Custom cookie name */
  cookie?: string
  /** Test variations */
  variations: SplitTestVariation[]
}

/** Split test variation declaration */
export interface SplitTestVariation {
  /** Variation name */
  name: string
  /** Variation probability */
  probability: number[]
}

/** Split options */
export interface SplitsOptions extends Omit<SetCookieItemOptions, 'raw'> {
  /** Cookie prefix */
  prefix?: string
}

/** Split calculation result */
export interface SplitsVariations {
  [key: string]: string
}

/**
 * Splits calculator
 *
 * ```ts
 * const tests = [
 *   {
 *     name: 'loginType',
 *     variations: [
 *       {
 *         name: 'compact',
 *         probability: [0, 0.5]
 *       },
 *       {
 *         name: 'full',
 *         probability: [0.5, 1]
 *       }
 *     ]
 *   }
 * ]
 *
 * const splits = new Splits(tests, {prefix: 'x_'})
 * const variations = splits.getVariations()
 *
 * // {loginType: 'compact'}
 * ```
 */
export class Splits {
  private tests: SplitTest[]
  private options: SplitsOptions

  public constructor(tests: SplitTest[], options: SplitsOptions = {}) {
    if (!Array.isArray(tests) || !tests.length) {
      throw new Error('expected `settings.tests` is not empty array')
    }

    tests.forEach(({name, variations}) => {
      if (!/^[A-Za-z0-9_-]+$/.test(name)) {
        throw new Error(
          `expected \`${name}\` contains \`A-Za-z0-9_-\` symbols only`
        )
      }

      if (!Array.isArray(variations) || !variations.length) {
        throw new Error(
          `expected \`variations\` of \`${name}\` is not empty array`
        )
      }

      variations.forEach(({name: varName, probability}) => {
        if (
          !Array.isArray(probability) ||
          typeof probability[0] !== 'number' ||
          typeof probability[1] !== 'number'
        ) {
          throw new Error(
            `expected \`probability\` of \`${name}.${varName}\` is array of numbers`
          )
        }
      })
    })

    this.tests = tests
    this.options = {...DEFAULT_OPTIONS, ...options}
  }

  /** Get calculated variations */
  public getVariations(): SplitsVariations {
    const variations = this.tests.reduce<SplitsVariations>(
      (accumulator, {name, cookie, variations}) => {
        accumulator[name] = this.chooseVariation(
          variations,
          this.getProbability(cookie || name, this.options)
        )

        return accumulator
      },
      {}
    )

    this.dropIrrelevantProbabilities()

    return variations
  }

  private dropIrrelevantProbabilities(): void {
    const items = getAll()

    const {
      tests,
      options: {prefix = '', ...options}
    } = this

    if (items) {
      const removal = Object.keys(items).filter(
        (cookieName) =>
          cookieName.indexOf(prefix) === 0 &&
          !tests.filter(
            ({name, cookie}) => cookieName === `${prefix}${cookie || name}`
          ).length
      )

      removal.forEach((cookieName) => removeItem(cookieName, options))
    }
  }

  private getProbability(name: string, {prefix = '', ...options}): number {
    const cookieName = `${prefix}${name}`
    let probability = getItem<number>(cookieName)

    if (!probability || typeof probability !== 'number') {
      probability = Math.random()
    }

    setItem<number>(cookieName, probability, options)

    return probability
  }

  private chooseVariation(
    variations: SplitTestVariation[],
    probability: number
  ): string {
    return variations.reduce<string>(
      (accumulator, {name, probability: [start, end]}) =>
        probability >= start && probability < end ? name : accumulator,
      'default'
    )
  }
}
