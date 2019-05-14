const FS    = require('fs')
const UTIL  = require('util')
const UUID  = require('uuid')

class Logger {
  
    /**
   * 
   * @param {*} args if true, print everything
   */
    constructor(args) {
        this.talkative  = (args.talk) ? true : false
        this.err_msg    = 'see logs for more informations log'
        this.location   = `${process.env.base_dir}/logs.log`
        this.session    = UUID.v4()

        // empty log file if clear param is provided
        if (args.clear) {
            FS.writeFileSync(this.location, '')
        }
    }

    __write(msg, lvl, data) {
        const __t = new Date()
        const __msg = {
            time: __t,
            level: lvl,
            message: msg,
            data: data,
            sessionID: this.session
        }
        if (this.talkative) console.log(UTIL.inspect(__msg, false, null, true))
        FS.appendFileSync(this.location, '\n' + JSON.stringify(__msg))
    }

    /**
   * Write a debug log
   * @param {*} msg 
   * @param  {...any} data 
   */
    d(msg, ...data) {
        this.__write(msg, 'DEBUG', data)
    }

    /**
   * Write a info log
   * @param {*} msg 
   * @param  {...any} data 
   */
    i(msg, ...data) {
        this.__write(msg, 'INFO', data)
    }

    /**
   * Write a error log
   * @param {*} msg 
   * @param  {...any} data 
   */
    e(msg, data) {
        console.log('Something went wrong please check the logs: ' + this.location)
        this.__write(msg, 'ERROR', data)
    }

    /**
     * Print a message with an object on the console
     * @param  {...any} data 
     */
    print(...data) {
        console.log(UTIL.inspect(data, false, null, true))
    }

    printLogLocation() {
        console.log(`Logs: ${this.location}`)
    }
}
module.exports = Logger