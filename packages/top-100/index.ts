/* eslint-disable import/no-unused-modules */
import waitForTarget from 'wait-for-target'
import {createDebug} from '@rambler-tech/debug'

const debug = createDebug('common:top-100')

/** Top 100 options */
export interface Top100Options {
  /** Project ID */
  project: number
  /** Blocks data attributes */
  dataset: string[]
  /** Counter parameters */
  params?: Record<string, any>
}

/** Top 100 counter */
export class Top100 {
  /** Counter options */
  options: Top100Options

  /** Promise that resolves when counter is ready */
  ready: Promise<void>

  /** Top 100 counter constructor */
  constructor(options: Top100Options) {
    this.options = options

    this.ready = new Promise((resolve) => {
      if (process.env.NODE_ENV === 'development') {
        resolve()

        return
      }

      /* eslint-disable */
      // prettier-ignore
      ;(function (w, d, c) {
        // @ts-ignore
        (w[c] = w[c] || []).push(function () {
          try {
            // @ts-ignore
            const counter = new top100({
              project: options.project,
              attributes_dataset: options.dataset,
              ...options.params
            })

            // @ts-ignore
            w[`top100Counter${options.project}`] = counter

            // @ts-ignore
            w.top100Counter = w.top100Counter || counter
          } catch {}
        });
        // @ts-ignore
        var n = d.getElementsByTagName("script")[0], s = d.createElement("script"), f = function () { n.parentNode.insertBefore(s, n); };
        s.type = "text/javascript";
        s.async = true;
        s.src =
          (d.location.protocol == "https:" ? "https:" : "http:") +
          "//st.top100.ru/top100/top100.js";
        s.onload = () => resolve()
        s.onerror = () => resolve()
        // @ts-ignore
        if (w.opera == "[object Opera]") {
          d.addEventListener("DOMContentLoaded", f, false);
        } else { f(); }
      })(window, document, "_top100q");
      /* eslint-enable */
    })
  }

  async run(method: string, ...args: any[]) {
    const {project} = this.options

    if (process.env.NODE_ENV === 'development') {
      debug(`${method} ${project} %o`, args)

      return
    }

    try {
      const counter = await waitForTarget(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => window[`top100Counter${project}`],
        1000
      )

      counter[method](...args)
    } catch {}
  }

  /** Send custom vars */
  async sendCustomVars(params: Record<string, any>) {
    await this.run('sendCustomVars', params)
  }

  /** Track page view */
  async trackPageview() {
    await this.run('trackPageview')
  }

  /** Track event */
  async trackEvent(eventName: string, eventData: Record<string, any>) {
    await this.run('trackEvent', eventName, eventData)
  }

  /** Update counter options */
  async updateOptions(options: Record<string, any>) {
    await this.run('updateOptions', options)
  }
}
