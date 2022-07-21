import { Command } from 'commander'
import { getConfig, installedPhp, setConfig } from '../utils.js'
import chalk from 'chalk'
import { symlinkSync, unlinkSync } from 'fs'

export default function init() {
  const command = new Command('use')
  command
    .description('create setting file')
    .addArgument('version', {
      description: 'php version',
      required: true,
    })
    .action(operation)
  return command
}

async function operation(version) {
  const config = getConfig()
  if (!config) {
    console.error(chalk.yellow('  config file is not exists'))
    console.error(
      chalk.red('please run ') +
        chalk.green.italic('init') +
        chalk.red(' first')
    )
    return
  }
  const php = installedPhp()
    .filter((file) => {
      const v = `${file.version.major}.${file.version.minor}.${file.version.patch}`
      return v.startsWith(version || '')
    })
    .sort((a, b) => {
      const v1 = `${a.version.major}.${a.version.minor}.${a.version.patch}`
      const v2 = `${b.version.major}.${b.version.minor}.${b.version.patch}`
      return v1.localeCompare(v2)
    })
    .pop()

  if (!php) {
    console.error(chalk.yellow(`  php with version ${version} is not exists`))
    return
  }
  setConfig('in-use', php.name)
  const oldPhpPath = `${config['link-dir']}`
  const phpPath = `${config['root-dir']}/${php.name}`
  try {
    unlinkSync(oldPhpPath, { recursive: true })
    symlinkSync(phpPath, config['link-dir'])
    console.log(
      `  using ` +
        `${chalk.bold(
          `PHP-${php.version.major}.${php.version.minor}.${php.version.patch}`
        )}` +
        ` ${chalk.green(`[${php.ts ? 'TS' : 'NTS'}]`)}` +
        ` ${chalk.yellow(`(${php.compiler} ${php.arch})`)}`
    )
  } catch (e) {
    console.error(
      chalk.red(`  failed to use `) +
        `${chalk.bold(
          `PHP-${php.version.major}.${php.version.minor}.${php.version.patch}`
        )}` +
        ` ${chalk.green(`[${php.ts ? 'TS' : 'NTS'}]`)}` +
        ` ${chalk.yellow(`(${php.compiler} ${php.arch})`)}`
    )
    console.error(chalk.red('  Try to run with elevated privileges'))
  }
}
