const MQ      = require('mqtt')
const CMD = require('./cmd')

const URL     = require('url')
const YAML    = require('yaml')
const FS      = require('fs')
const ORA     = require('ora')

class MQTT extends CMD{  
  constructor(args) {
    super(args)
    this.spinner = ORA()
    this.spinnerText = 'Waiting for some friends\n'
    this.config
    this.service   = args.service || args.s
    this.operation = args.operation || args.o
    this.topic     = args.topic || args.t
    this.message   = args.message || args.m
    this.device    = args.device || args.d

    this.__handle()
  }
  
  async __handle() {
    let url, opts = ''
    
    try {
      this.config = FS.readFileSync(`${process.env.base_dir}/lib/${this.service}/conf.yaml`).toString('utf8')
      this.config = YAML.parse(this.config)
      this.logger.d('Configuration', this.config)
      this.topic = this.config.mqtt.topics[this.topic]
      url = URL.parse(`${this.config.mqtt.protocol}://${this.config.mqtt.uri}:${this.config.mqtt.port}`)
      opts = {
        rejectUnauthorized: true,
        ca: FS.readFileSync(`${process.env.base_dir}/lib/osram/olt_ca.pem`),
        cert: FS.readFileSync(`${process.env.base_dir}/lib/osram/device/${this.device}_cert.pem`),
        key: FS.readFileSync(`${process.env.base_dir}/lib/osram/device/${this.device}_key.pem`)
      }
    } catch (error) {
      this.logger.e('Error when trying to read Configuration', error.toString())
      process.exit(1)
    }

    try {
      if (this.message) {
        this.message = FS.readFileSync(`${process.env.base_dir}/lib/${this.service}/mqttMessages/${this.message}.json`).toString('utf8')
        this.message = JSON.stringify(JSON.parse(this.message))
      }
    } catch (error) {
      this.logger.d('No message file found. Msg is a string', error.toString)
      this.message = this.message
    }

    try {
      this.logger.d('Trying to connect', url, opts)
      this.client = MQ.connect(url, opts)
    } catch (error) {
      this.logger.e('Error when trying to connect', error.toString())
      process.exit(1)
    }


    // this.client = MQ.connect([{ host: 'mqtt://mqtt.lightelligence.io', port: 8883 }])

    this.client.on('packetreceive', (packet) => {
      this.logger.d('Packet received', packet)
    })
    this.client.on('packetsend', (packet) => {
      this.logger.d('Packet sent', packet)
    })
    this.client.on('connect', (connack) => {
      this.logger.i('Client is connected', connack)
      clearTimeout(this.timer)
      this.__operate(this.operation)
    })
    this.client.on('error', (error) => {
      this.logger.e('Client received error', { msg: error.message, stack: error.stack })
    })
    this.client.on('end', () => {
      this.logger.i('Client terminated')
    })

    this.timer = setTimeout(() => {
      if(!this.client.connected) {
        this.logger.e('Can not establish connection')
        process.exit(1)
      }
    }, 5000)
  }

  async __operate(opt) {
    try {
      switch (opt) {
      case 'publish':
        this.spinner.start('Sending....')
        await this.__subscribe(this.topic)
        await this.__publish(this.topic, this.message)
        this.client.end()
        this.spinner.succeed('Sent')
        process.exit(0)
        break
      case 'subscribe':
      default:
        this.logger.printLogLocation()
        this.spinner.start(`Listenning on topic: ${this.topic} ... \n`)
        await this.__subscribe(this.topic)
        this.client.on('message', (topic, message) => this.__receive(topic, message))
        break
      }
    } catch (error) {
      this.logger.e('Something went wrong with mqtt', error.toString())
      process.exit(1)
    }
  }

  __subscribe(topic) {
    return new Promise((resolve, reject) => {
      this.client.subscribe(topic, (err, granted) => {
        if (err) {
          this.logger.e(`Error when trying to subscribe to: ${topic}`, err)
          reject(err)
        }
        this.logger.d(`Subscribed to: ${topic}`, granted)
        resolve()
      })
    })
  }
  
  __publish(topic) {
    return new Promise((resolve, reject) => {
      this.client.publish(topic, this.message, {qos: 1}, (err) => {
        if (err) {
          this.logger.e(`Error when trying to publish to: ${topic}`, err)
          reject(err)
        }
        this.logger.d(`Published to: ${topic}`, this.message)
        resolve()
      })
    })
  }

  __receive(topic, msg) {
    this.logger.d('Message receive', {topic, message: msg.toString()})
    this.spinner.succeed(msg.toString())
    this.spinner.start('Listenning...\n')
  }
}

module.exports = MQTT