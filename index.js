process.env.base_dir = __dirname

const MN  = require('minimist')
const R   = require('./cmds/request')
const MQ  = require('./cmds/mqtt') 
const WS  = require('./cmds/websocket') 
const U   = require('./lib/utils/utlis') 
const Z   = require('./cmds/zosram')


module.exports = () => {
  const args    = MN(process.argv.slice(2))
  const utils   = new U()
  const ws      = new WS()

  let cmd = args._[0]

  if (args.version || args.v) cmd = 'version'
  if (args.help || args.h)    cmd = 'help'

  switch (cmd) {
  case 'mqtt':
    new MQ(args)
    break
  case 'help':
    utils.help(args)
    break
  case 'request':
    new R(args)
    break
  case 'version':
    utils.version(args)
    break
  case 'ws': 
    ws.start(args)
    break
  case 'zosram': 
    new Z(args)
    break
  default:
    console.error(`"${cmd}" does not exist in Zed world...`)
    process.exit(0)
    break
  }
}