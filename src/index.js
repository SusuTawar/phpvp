import { program } from 'commander'
import init from './commands/init.js'
import list from './commands/list.js'
import use from './commands/use.js'

console.log()

program.addCommand(init())
program.addCommand(list())
program.addCommand(use())

program.parse(process.argv)
