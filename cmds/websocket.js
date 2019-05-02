const WSCLIENT = require('websocket').client

class WebSocket {
  constructor() {
    this.client = new WSCLIENT()
    this.client.on('connect', (connection) => this.__connect(connection))
  }

  start(args) {
    const url = args.url || args.u
    this.client.connect(url)
  }

  __connect(connection) {
    console.log('connection ok') 
    this.connection = connection
    this.connection.on('message', (message) => this.__message(message))
  }

  __message(message) {
    console.log('MSG', message)
  }
}

module.exports = WebSocket