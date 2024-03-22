import {green, red, yellow, type Chalk} from 'chalk'
import type {Report} from './report'

const METRIC_NAME_LENGTH = 18

const CRITICAL_TRESHOLD = 0.5
const WARN_TRESHOLD = 0.9

const TRESHOLDS: [number, Chalk][] = [
  [CRITICAL_TRESHOLD, red],
  [WARN_TRESHOLD, yellow],
  [Infinity, green]
]

function formatMetricValue(value: number) {
  const [, color]: any = TRESHOLDS.find(([treshold]) => value < treshold)

  return color(value.toFixed(2))
}

export function formatReport(report: Report) {
  let output = '\nLighthouse report\n'

  Object.entries(report).forEach(([url, metrics]) => {
    output += '\n'
    output += `URL: ${url}`
    output += '\n'
    output += `Number of runs: ${metrics.performance.length}`
    output += '\n\n'

    Object.entries(metrics).forEach(([metric, values]) => {
      const row = [
        metric.padEnd(METRIC_NAME_LENGTH, ' '),
        ...values.map(formatMetricValue)
      ]

      output += row.join('  ')
      output += '\n'
    })
  })

  return output
}
