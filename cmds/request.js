const RPN   = require('request-promise-native')
const FS    = require('fs')
const YAML  = require('yaml')
const ORA   = require('ora')
const CMD   = require('./cmd')

class Request extends CMD{

    constructor(args) {
        super(args)
        this.options    = {}
        this.service    = args.service  || args.s
        this.options    = args.options  || args.o
        this.token      = args.token    || args.t
        if (typeof this.token === 'undefined') {
            this.logger.e('Token is undefined', this.token)
            process.exit(1)
        } 
        this.__handle()
    }

    __handle() {
        const __spinner = ORA('Sending request\n')
        let option      = ''
        let config      = {}

        // read config file
        config  = FS.readFileSync(`${process.env.base_dir}/lib/${this.service}/conf.yaml`).toString('utf8')
        // read option file --option param
        option  = FS.readFileSync(`${process.env.base_dir}/lib/${this.service}/options/${this.options}.json`).toString('utf8')
        config  = YAML.parse(config).api
        option  = JSON.parse(option)
        this.logger.d('Configuration', config)
        
        // parametize token
        if (option.headers) option.headers.Authorization.replace('token', this.token) 
        this.__replaceOption(option, config, this.__replaceString, this)

        this.logger.d('request to send', option)
        __spinner.start()

        RPN(option)
            .then(data => {
                __spinner.succeed(`Success, logs: ${process.env.base_dir}/logs.log`)
                this.logger.i('Request success', data)
                process.exit(0)
            })
            .catch(err => {
                __spinner.fail()
                this.logger.e('Error during request', err)
                process.exit(1)
            })
    }

    /**
     * Replace placeholders in options using cong file
     * @param {*} options 
     * @param {*} configuration 
     * @param {*} fn 
     * @param {*} self 
     */
    __replaceOption(options, configuration, fn, self) {
        Object.keys(options).forEach(key => {
            fn(options, key, configuration, self)
            if (typeof options[key] === 'object') {
                let item = options[key]
                this.__replaceOption(item, configuration, fn, self)
            }
        })
    }

    /**
     * Replace a string 
     * @param {*} parent 
     * @param {*} str 
     * @param {*} config 
     * @param {*} self 
     */
    __replaceString(parent, str, config, self) {
        if (typeof parent[str] === 'string') {
            for (const conf in config) {
                switch (config[conf].type) {
                case 'file':
                    parent[str] = parent[str].replace('{' + conf + '}', FS.readFileSync(`${process.env.base_dir}/lib/${self.service}/${config[conf].value}`).toString('utf8'))
                    break
                case 'string':
                    parent[str] = parent[str].replace('{' + conf + '}', config[conf].value)
                    break
                case 'list': 
                    for (const obj in config[conf].values) {
                        parent[str] = parent[str].replace('{' + obj + '}', config[conf].values[obj].value)
                    }

                    break
                default:
                    self.logger.e(`ERROR: Type ${config[conf].type} not supported in ${conf}`)
                    process.exit(1)
                }
            }
        }
    }
}

module.exports = Request
