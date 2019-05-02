const CMD = require('./cmd')

class Zosram extends CMD {

  constructor(args) {
    super(args)
    this.tenant = args.tenant || args.t
    this.operations = args.operations || args.o
    this.__handle()
  }

  __handle() {
    switch(this.operations) {
    case '':
      break
    default:
      this.logger.e(`Operations ${this.operations} not supported yet`)
      process.exit(1)
    }
  }

}

module.exports = Zosram