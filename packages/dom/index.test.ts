import {injectStyleSheet} from '.'

test('inject style', () => {
  const button = document.createElement('button')

  button.className = 'test-button'

  document.body.appendChild(button)

  expect(window.getComputedStyle(button).display).toBe('inline-block')

  injectStyleSheet('.test-button {display: flex;}')

  expect(window.getComputedStyle(button).display).toBe('flex')
})

test('inject style with attributes', () => {
  const button = document.createElement('button')

  button.className = 'test-button-2'

  document.body.appendChild(button)

  expect(window.getComputedStyle(button).display).toBe('inline-block')

  const style = injectStyleSheet('.test-button-2 {display: flex;}', {
    'data-scope': 'button'
  })

  expect(window.getComputedStyle(button).display).toBe('flex')
  expect(style.getAttribute('data-scope')).toBe('button')
})
