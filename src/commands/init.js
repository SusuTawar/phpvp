import { existsSync } from 'fs'
import inquirer from 'inquirer'
import { Command } from 'commander'
import { getConfig, setConfig } from '../utils.js'
import { dirname } from 'path'

export default function init() {
  const command = new Command('init')
  command.description('create setting file').action(operation)
  return command
}

async function operation() {
  const oldSetting = getConfig()
  const setting = oldSetting ?? {
    'link-dir': '',
    'root-dir': '',
    'in-use': '',
  }
  const input = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'link-dir',
        message: 'directory to symlink',
        default: setting['link-dir'],
      },
      {
        type: 'input',
        name: 'root-dir',
        message: 'directory to store php files',
        default: setting['root-dir'],
      },
    ])
    .catch((err) => {
      console.error(err)
      return {
        'link-dir': '',
        'root-dir': '',
        'in-use': '',
      }
    })
  if (input['link-dir'] === '') {
    console.error('link directory is empty')
    return
  }
  if (!existsSync(dirname(input['link-dir']))) {
    console.error('link directory is not exists')
    return
  }
  setConfig('link-dir', input['link-dir'])
  if (input['root-dir'] === '') {
    console.error('root directory is empty')
    return
  }
  if (!existsSync(input['root-dir'])) {
    console.error('root directory is not exists')
    return
  }
  setConfig('root-dir', input['root-dir'])
}
