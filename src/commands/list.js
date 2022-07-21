import { Command } from 'commander'
import { getConfig, breakdownPhpVersion, installedPhp } from '../utils.js'
import chalk from 'chalk'

export default function init() {
  const command = new Command('list')
  command.description('create setting file').action(operation)
  return command
}

async function operation() {
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
  installedPhp().forEach((file) => {
    const inUse =
      file.name === config['in-use'] ? `[${chalk.green('✔')}]` : '[ ]'
    const version = chalk.bold(
      `PHP-${file.version.major}.${file.version.minor}.${file.version.patch}`.padEnd(
        13
      )
    )
    const ts = chalk.green(`[${file.ts ? 'TS' : 'NTS'}]`.padEnd(5))
    const arch = chalk.yellow(`(${file.compiler} ${file.arch})`.padEnd(6))
    console.log(` ${inUse} ${version} ${ts} ${arch}`)
  })
}
