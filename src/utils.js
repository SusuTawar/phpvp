import { readFileSync, existsSync, writeFileSync } from 'fs'
import { resolve, basename, dirname } from 'path'
import { parse, stringify } from 'ini'
import { readdirSync } from 'fs'

const path = dirname(process.execPath)
export const configPath = resolve(path, './config.ini')

export function getConfig() {
  if (!existsSync(configPath)) {
    return null
  }
  return parse(readFileSync(configPath, 'utf8'))
}

export function breakdownPhpVersion(version) {
  const [, major, minor, patch, debug, nts, _, compiler, mArch] = version.match(
    /([\d\w]+)\.([\d\w]+)\.([\d\w]+)(-\d+)?(-nts)?-win32(-([\w\d]+)?-(x\d{2})?)?/i
  )
  return {
    version: {
      major,
      minor,
      patch,
      debug,
    },
    ts: !nts,
    compiler,
    arch: mArch,
  }
}

export function installedPhp() {
  const config = getConfig()
  const files = readdirSync(config['root-dir'])
  return files
    .filter((file) => {
      const dir = basename(config['link-dir'])
      return file !== dir
    })
    .map((version) => {
      return {
        name: version,
        ...breakdownPhpVersion(version),
      }
    })
}

export function setConfig(key, value) {
  const config = getConfig() ?? {
    'link-dir': '',
    'root-dir': '',
    'in-use': '',
  }
  // check if key is exists
  const acceptedKeys = ['link-dir', 'root-dir', 'in-use']
  if (!config[key] && !acceptedKeys.includes(key)) {
    throw new Error(`configuration ${key} does not exists`)
  }
  config[key] = value
  writeFileSync(configPath, stringify(config))
}
