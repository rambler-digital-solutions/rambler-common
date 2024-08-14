/* eslint-disable import/no-unused-modules */
import waitForTarget from 'wait-for-target'
import {createDebug} from '@rambler-tech/debug'

const debug = createDebug('common:yandex-metrica')

const DEFAULT_YANDEX_METRICA_PARAMS = {
  clickmap: true,
  trackLinks: true,
  triggerEvent: true,
  accurateTrackBounce: true,
  trackHash: true,
  webvisor: true
}

/** Yandex Metrica options */
export interface YandexMetricaOptions {
  id: number
  params?: Record<string, any>
}

/** Yandex Metrica */
export class YandexMetrica {
  options: YandexMetricaOptions
  ready: Promise<void>

  constructor(options: YandexMetricaOptions) {
    this.options = options

    this.ready = new Promise((resolve) => {
      if (process.env.NODE_ENV === 'development') {
        resolve()

        return
      }
      /* eslint-disable */
      // prettier-ignore
      ;(function (m, e, t, r, i, k, a) {
        // @ts-ignore
        m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
        // @ts-ignore
        m[i].l = 1 * new Date(); k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, k.onload = () => resolve(), k.onerror = () => resolve(), a.parentNode.insertBefore(k, a)
      })
        (window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')
      try {
        // @ts-ignore
        ym(options.id, 'init', {
          ...DEFAULT_YANDEX_METRICA_PARAMS,
          ...options.params
        })
      } catch (e) {}
      /* eslint-enable */
    })
  }

  async run(method: string, ...args: any[]) {
    const {id} = this.options

    if (process.env.NODE_ENV === 'development') {
      debug(`${method} ${id} %o`, args)

      return
    }

    try {
      const counter = await waitForTarget(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => window.ym,
        1000
      )

      counter(id, method, ...args)
    } catch {}
  }

  async hit(params: Record<string, any>) {
    await this.run('hit', params)
  }

  async setParams(params: Record<string, any>) {
    await this.run('params', params)
  }

  async reachGoal(...args: any[]) {
    await this.run('reachGoal', ...args)
  }
}
