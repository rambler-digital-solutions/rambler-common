export type Manifest = {
  url: string
  summary: Record<string, number>
}[]

export type Report = Record<string, Record<string, number[]>>

export function getReport(manifest: Manifest) {
  return manifest.reduce((acc, {url, summary}) => {
    Object.entries(summary).forEach(([metric, value]) => {
      acc[url] ??= {}
      acc[url][metric] ??= []
      acc[url][metric].push(value)
    })

    return acc
  }, {} as Report)
}
