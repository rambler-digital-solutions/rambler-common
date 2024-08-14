/* eslint-disable import/no-unused-modules */

/** Inject style sheet to DOM */
export function injectStyleSheet(
  cssText: string,
  attributes: Record<string, any> = {}
): HTMLStyleElement {
  const style = document.createElement('style')

  style.textContent = cssText

  if (attributes) {
    Object.entries(attributes).forEach(([name, value]) => {
      style.setAttribute(name, value)
    })
  }

  return document.head.appendChild(style)
}

const REGISTRY = '__ASSETS_REGISTRY__'

declare const globalThis: any
globalThis[REGISTRY] = {}

/** Load style sheet */
export function loadStyleSheet(source: string): Promise<HTMLLinkElement> {
  globalThis[REGISTRY][source] ??= new Promise<HTMLLinkElement>(
    (resolve, reject) => {
      const link = document.createElement('link')

      link.rel = 'stylesheet'
      link.href = source

      link.onload = () => {
        resolve(link)
      }

      link.onerror = () => {
        reject(new Error(`stylesheet not loaded: ${source}`))
      }

      document.head.appendChild(link)
    }
  )

  return globalThis[REGISTRY][source]
}

/** Load script */
export function loadScript(source: string): Promise<HTMLScriptElement> {
  globalThis[REGISTRY][source] ??= new Promise<HTMLScriptElement>(
    (resolve, reject) => {
      const script = document.createElement('script')

      script.src = source
      script.async = true
      script.type = 'text/javascript'

      script.onload = () => {
        resolve(script)
      }

      script.onerror = () => {
        reject(new Error(`script not loaded: ${source}`))
      }

      document.body.appendChild(script)
    }
  )

  return globalThis[REGISTRY][source]
}
