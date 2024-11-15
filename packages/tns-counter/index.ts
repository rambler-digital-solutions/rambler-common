/* eslint-disable import/no-unused-modules */

/** TNS counter options */
export interface TnsCounterOptions {
  /** Account ID */
  account: string
  /** Param */
  tmsec: string
}

/** TNS counter */
export class TnsCounter {
  /** Promise that resolves when counter is ready */
  ready: Promise<void>

  /** TNS counter constructor */
  constructor(options: TnsCounterOptions) {
    this.ready = new Promise((resolve) => {
      if (process.env.NODE_ENV === 'development') {
        resolve()

        return
      }

      /* eslint-disable */
      // prettier-ignore
      ;(function(win, doc, cb){
        // @ts-ignore
        (win[cb] = win[cb] || []).push(function() {
          try {
            // @ts-ignore
            win[`tnsCounter${options.account}_${options.tmsec}`] = new Mediascope.TnsCounter({
              account: options.account,
              tmsec: options.tmsec
            });
          } catch {}
        });
        var tnsscript = doc.createElement('script');
        tnsscript.type = 'text/javascript';
        tnsscript.async = true;
        tnsscript.src = ('https:' == doc.location.protocol ? 'https:' : 'http:') +
          '//www.tns-counter.ru/tcounter.js';
        tnsscript.onload = () => resolve();
        tnsscript.onerror = () => resolve();
        var s = doc.getElementsByTagName('script')[0];
        // @ts-ignore
        s.parentNode.insertBefore(tnsscript, s);
      })(window, window.document,'tnscounter_callback');
      /* eslint-enable */
    })
  }
}
