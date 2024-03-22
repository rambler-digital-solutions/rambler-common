#!/usr/bin/env node
import * as path from 'path'
import * as fs from 'fs/promises'
import {formatReport} from './format'
import {getReport, type Manifest} from './report'

async function print(dir: string) {
  const manifestFile = path.resolve(dir, 'manifest.json')
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const manifestJson = await fs.readFile(manifestFile, 'utf8')
  const manifest: Manifest = JSON.parse(manifestJson)
  const report = getReport(manifest)

  // eslint-disable-next-line no-console
  console.log(formatReport(report))
}

const [, , reportDir] = process.argv

if (!reportDir) {
  throw new Error('report dir not exists')
}

print(path.resolve(process.cwd(), reportDir))
