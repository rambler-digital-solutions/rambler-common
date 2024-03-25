import {getReport} from './report'

test('get a report', () => {
  const mock = [
    {
      url: 'http://example.com',
      summary: {
        performance: 1,
        acccessibility: 0.5,
        'best-practices': 0.6,
        seo: 0.2,
        pwa: 0.1
      }
    },
    {
      url: 'http://example.com',
      summary: {
        performance: 0.9,
        acccessibility: 0.6,
        'best-practices': 0.5,
        seo: 0.3,
        pwa: 0.4
      }
    }
  ]

  const report = getReport(mock)

  expect(report).toEqual({
    'http://example.com': {
      performance: [1, 0.9],
      acccessibility: [0.5, 0.6],
      'best-practices': [0.6, 0.5],
      seo: [0.2, 0.3],
      pwa: [0.1, 0.4]
    }
  })
})
