#!/usr/bin/env node
import * as path from 'path'
import * as fs from 'fs/promises'
import {formatReport} from './format'
import {getReport, type Manifest} from './report'

function readConfig(dir: string) {
  const configFile = path.resolve(dir, 'lighthouserc')

  // eslint-disable-next-line security/detect-non-literal-require
  return require(configFile)
}

async function readManifest(dir: string) {
  const manifestFile = path.resolve(dir, 'manifest.json')
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const manifestJson = await fs.readFile(manifestFile, 'utf8')

  return JSON.parse(manifestJson) as Manifest
}

async function print(dir: string) {
  const manifest = await readManifest(dir)
  const report = getReport(manifest)

  // eslint-disable-next-line no-console
  console.log(formatReport(report))
}

const config = readConfig(process.cwd())
const [, , reportDir = config.ci?.upload?.outputDir] = process.argv

if (!reportDir) {
  throw new Error('report dir not exists')
}

print(path.resolve(process.cwd(), reportDir))
