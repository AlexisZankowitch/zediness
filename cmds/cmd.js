const LOGGER = require('../lib/utils/logger')

class CMD {
  constructor(args) {
    this.logger = new LOGGER(args)
  }
}

module.exports = CMD