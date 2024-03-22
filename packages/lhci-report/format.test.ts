import {green, red, yellow} from 'chalk'
import {formatReport} from './format'

test('format the report', () => {
  const mock = {
    'http://example.com': {
      performance: [1, 0.9],
      accessibility: [0.5, 0.6],
      'best-practices': [0.6, 0.5],
      seo: [0.2, 0.3],
      pwa: [0.1, 0.4]
    }
  }

  const report = formatReport(mock)

  expect(report).toContain('URL: http://example.com')
  expect(report).toContain('Number of runs: 2')
  expect(report).toContain(
    `performance         ${green('1.00')}  ${green('0.90')}`
  )
  expect(report).toContain(
    `accessibility       ${yellow('0.50')}  ${yellow('0.60')}`
  )
  expect(report).toContain(
    `best-practices      ${yellow('0.60')}  ${yellow('0.50')}`
  )
  expect(report).toContain(`seo                 ${red('0.20')}  ${red('0.30')}`)
  expect(report).toContain(`pwa                 ${red('0.10')}  ${red('0.40')}`)
})
